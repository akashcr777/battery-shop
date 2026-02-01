#!/usr/bin/env node

/**
 * Setup Script for Image Folders
 * 
 * This script automatically creates the necessary folder structure
 * for your battery shop images.
 * 
 * Run: node setup-images.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up image folders...\n');

// Define folders to create
const folders = [
  'frontend/public/images',
  'frontend/public/images/products'
];

// Create folders
let created = 0;
let existed = 0;

folders.forEach(folder => {
  const fullPath = path.join(__dirname, folder);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${folder}`);
    created++;
  } else {
    console.log(`✓  Exists: ${folder}`);
    existed++;
  }
});

console.log('\n📊 Summary:');
console.log(`   Created: ${created} folder${created !== 1 ? 's' : ''}`);
console.log(`   Existed: ${existed} folder${existed !== 1 ? 's' : ''}`);

// Create README in images folder
const readmePath = path.join(__dirname, 'frontend/public/images/README.txt');
if (!fs.existsSync(readmePath)) {
  const readmeContent = `# Product Images Folder

Add your battery and UPS product images here!

REQUIRED (Minimum 8 images):
- battery-two-wheeler.jpg
- battery-three-wheeler.jpg
- battery-four-wheeler.jpg
- battery-truck.jpg
- battery-home.jpg
- ups-type1.jpg
- ups-type2.jpg
- ups-type3.jpg

OPTIONAL (Product-specific images):
- You can paste product images directly here, OR
- Put them in the products/ subfolder for organization

Examples:
- exide-xplore-xltz4a-4ah.jpg
- apc-ups-600va.jpg
- etc.

See PRODUCT_IMAGES_LIST.md in the root folder for all 55 product filenames.

The system automatically finds images in either location!
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('\n📝 Created: README.txt in images folder');
}

console.log('\n✨ Setup complete!\n');
console.log('📁 Folder structure:');
console.log('   frontend/public/images/          ← Paste all images here');
console.log('   frontend/public/images/products/ ← Optional subfolder\n');

console.log('📸 Next steps:');
console.log('   1. Add 8 category images to frontend/public/images/');
console.log('   2. Optionally add product-specific images');
console.log('   3. Start your app and see the images!\n');

console.log('📖 For detailed instructions, see:');
console.log('   - START_HERE.md');
console.log('   - SIMPLE_IMAGE_GUIDE.md');
console.log('   - PRODUCT_IMAGES_LIST.md\n');

console.log('🎉 Happy coding!\n');
