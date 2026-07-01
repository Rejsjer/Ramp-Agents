#!/usr/bin/env node
/**
 * PostToolUse Hook - Code Formatting
 * Runs after every tool execution to format and clean code output
 * 
 * Rule #6: PostToolUse hook for deterministic code formatting
 */

const fs = require('fs');
const path = require('path');

async function formatCodeOutput(toolResult) {
  try {
    // If result contains code blocks, format them
    if (toolResult.code || toolResult.output) {
      const content = toolResult.code || toolResult.output;
      
      // Apply formatting rules
      const formatted = {
        ...toolResult,
        formatted: true,
        formattedAt: new Date().toISOString(),
        code: formatCode(content)
      };
      
      return formatted;
    }
    
    return toolResult;
  } catch (error) {
    console.error('PostToolUse hook error:', error);
    return toolResult;
  }
}

function formatCode(code) {
  // Add formatting logic here (indentation, linting, etc.)
  // This is a placeholder for your specific formatting rules
  return code
    .trim()
    .replace(/\s+\n/g, '\n') // Remove trailing whitespace
    .replace(/\n\n\n+/g, '\n\n'); // Normalize multiple newlines
}

module.exports = { formatCodeOutput };
