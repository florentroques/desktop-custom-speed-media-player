#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Building Desktop Custom Speed Media Player for production...\n');

try {
  // Build React application
  console.log('📦 Building React application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ React build completed successfully!');
  console.log('\n🎯 To build for distribution, run:');
  console.log('   npm run dist        # Build for all platforms');
  console.log('   npm run dist:win    # Build for Windows');
  console.log('   npm run dist:mac    # Build for macOS');
  console.log('   npm run dist:linux  # Build for Linux');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
