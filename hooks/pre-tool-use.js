#!/usr/bin/env node
/**
 * Pre-ToolUse Hook - Permission Verification
 * Validates command against permissions list before execution
 * 
 * Rule #7: Pre-approve safe commands via permissions list
 */

const fs = require('fs');
const path = require('path');

async function verifyCommandPermission(command, args) {
  try {
    const permissionsFile = path.join(__dirname, '../config/permissions.json');
    const permissions = JSON.parse(fs.readFileSync(permissionsFile, 'utf8'));
    
    // Extract command name
    const commandName = command.split(' ')[0];
    
    // Check if auto-approval is enabled
    if (!permissions.autoApprovalEnabled) {
      return { approved: false, reason: 'Auto-approval disabled' };
    }
    
    // Check approved commands
    for (const category in permissions.approvedCommands) {
      if (permissions.approvedCommands[category].includes(commandName)) {
        return { approved: true, category };
      }
    }
    
    // Check blocked commands
    if (permissions.blockedCommands.commands.includes(commandName)) {
      return { approved: false, reason: 'Command is blocked', command: commandName };
    }
    
    // Check requires approval
    if (permissions.requiresApproval.commands.includes(commandName)) {
      return { approved: false, reason: 'Requires explicit approval', command: commandName };
    }
    
    return { approved: false, reason: 'Unknown command', command: commandName };
    
  } catch (error) {
    console.error('Pre-ToolUse hook error:', error);
    return { approved: false, reason: 'Hook execution error' };
  }
}

module.exports = { verifyCommandPermission };
