#!/usr/bin/env node

/**
 * Fix Image Names Script
 * 
 * This script renames .png and .jpeg files to .jpg
 * Run: node fix-image-names.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing image file extensions...\n');

const imagesDir = path.join(__dirname, 'frontend/public/images');

// Files that need to be renamed
const renames = [
  { from: 'ups-type2.png', to: 'ups-type2.jpg' },
  { from: 'ups-type3.jpeg', to: 'ups-type3.jpg' }
];

let renamed = 0;
let notFound = 0;

renames.forEach(({ from, to }) => {
  const fromPath = path.join(imagesDir, from);
  const toPath = path.join(imagesDir, to);
  
  if (fs.existsSync(fromPath)) {
    try {
      fs.renameSync(fromPath, toPath);
      console.log(`✅ Renamed: ${from} → ${to}`);
      renamed++;
    } catch (error) {
      console.log(`❌ Failed to rename ${from}: ${error.message}`);
    }
  } else {
    console.log(`⏭️  File not found: ${from}`);
    notFound++;
  }
});

console.log('\n📊 Summary:');
console.log(`   Renamed: ${renamed} file${renamed !== 1 ? 's' : ''}`);
console.log(`   Not found: ${notFound} file${notFound !== 1 ? 's' : ''}`);

if (renamed > 0) {
  console.log('\n✨ Done! Now refresh your browser (Ctrl+Shift+R)\n');
} else {
  console.log('\n💡 No files needed renaming. Check if they already have .jpg extension.\n');
}
