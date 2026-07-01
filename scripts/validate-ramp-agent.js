const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const registryPath = path.join(rootDir, 'skills', 'registry.json');

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`[PASS] ${message}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function walkMarkdown(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdown(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

function extractList(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const values = [];
  let inList = false;
  const keyPattern = new RegExp(`^${key}:\\s*$`);

  for (const line of lines) {
    if (keyPattern.test(line)) {
      inList = true;
      continue;
    }

    if (inList && /^[A-Za-z_][A-Za-z0-9_-]*:/.test(line)) {
      break;
    }

    if (inList) {
      const item = line.match(/^\s*-\s+["']?([^"']+)["']?\s*$/);
      if (item) values.push(item[1]);
    }
  }

  return values;
}

const registry = readJson(registryPath);
const skills = registry.skills || [];
const ids = new Set(skills.map((skill) => skill.id));

if (skills.length === registry.totalSkills) {
  pass(`registry totalSkills matches skills array (${skills.length})`);
} else {
  fail(`registry totalSkills is ${registry.totalSkills}, but skills array has ${skills.length}`);
}

if (ids.size === skills.length) {
  pass('registry skill IDs are unique');
} else {
  fail('registry contains duplicate skill IDs');
}

const counts = {};
for (const skill of skills) {
  counts[skill.category] = (counts[skill.category] || 0) + 1;

  if (skill.file) {
    const skillFile = path.join(rootDir, skill.file);
    if (fs.existsSync(skillFile)) {
      pass(`registered file exists for ${skill.id}`);
    } else {
      fail(`registered file is missing for ${skill.id}: ${skill.file}`);
    }
  }

  for (const dependency of skill.dependencies || []) {
    if (!ids.has(dependency)) {
      fail(`${skill.id} depends on unregistered skill ${dependency}`);
    }
  }
}

for (const [category, expected] of Object.entries(registry.byCategory || {})) {
  const actual = counts[category] || 0;
  if (actual === expected) {
    pass(`category count matches for ${category} (${actual})`);
  } else {
    fail(`category ${category} count is ${actual}, expected ${expected}`);
  }
}

for (const file of walkMarkdown(path.join(rootDir, 'skills'))) {
  if (file === registryPath) continue;

  const content = fs.readFileSync(file, 'utf8');
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    fail(`missing YAML frontmatter: ${path.relative(rootDir, file)}`);
    continue;
  }

  for (const skillRef of extractList(frontmatter, 'skills')) {
    if (!ids.has(skillRef)) {
      fail(`${path.relative(rootDir, file)} references unregistered skill ${skillRef}`);
    }
  }
}

try {
  const api = require(path.join(rootDir, 'vscode-integration', 'agent-api'));
  const discovered = api.discoverSkills();
  if (discovered.length === skills.length) {
    pass(`VS Code discovery returns ${discovered.length} skills`);
  } else {
    fail(`VS Code discovery returns ${discovered.length} skills, expected ${skills.length}`);
  }
} catch (error) {
  fail(`VS Code discovery failed: ${error.message}`);
}

if (process.exitCode) {
  console.error('\nRamp-Agent validation failed.');
} else {
  console.log('\nRamp-Agent validation passed.');
}
