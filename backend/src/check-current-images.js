const fs = require('fs');
const path = require('path');

const menuFilePath = path.join(__dirname, 'maharashtraMenu.ts');
const publicDir = path.join(__dirname, '../../frontend/public');

if (!fs.existsSync(menuFilePath)) {
  console.error(`Error: Menu file not found at ${menuFilePath}`);
  process.exit(1);
}

console.log(`Reading menu file: ${menuFilePath}`);
const menuContent = fs.readFileSync(menuFilePath, 'utf8');

// Parse category blocks
const categoriesBlockMatch = menuContent.match(/export const MENU_CATEGORIES = \[\s*([\s\S]*?)\s*\];/);
const categories = [];
if (categoriesBlockMatch) {
  const blockText = categoriesBlockMatch[1];
  const blocks = blockText.match(/\{[\s\S]*?\}/g) || [];
  for (const block of blocks) {
    const idMatch = block.match(/id:\s*['"`]([^'"`]+)['"`]/);
    const nameMatch = block.match(/name:\s*['"`]([^'"`]+)['"`]/);
    const imageMatch = block.match(/image:\s*['"`]([^'"`]+)['"`]/);
    if (idMatch && nameMatch && imageMatch) {
      categories.push({
        type: 'Category',
        id: idMatch[1],
        name: nameMatch[1],
        image: imageMatch[1]
      });
    }
  }
}

// Parse inventory/item blocks
const items = [];
const itemsTextStart = menuContent.indexOf('const inventoryByCategory');
if (itemsTextStart !== -1) {
  // Grab from inventoryByCategory until the end of the array definition
  const itemsTextEnd = menuContent.indexOf('];', itemsTextStart);
  const itemsText = menuContent.substring(itemsTextStart, itemsTextEnd + 2);
  
  const blocks = itemsText.match(/\{[\s\S]*?\}/g) || [];
  for (const block of blocks) {
    if (block.includes('items:')) continue; // Skip category wrapper blocks
    const idMatch = block.match(/id:\s*['"`]([^'"`]+)['"`]/);
    const nameMatch = block.match(/name:\s*['"`]([^'"`]+)['"`]/);
    const imageMatch = block.match(/image:\s*['"`]([^'"`]+)['"`]/);
    if (nameMatch && imageMatch) {
      items.push({
        type: 'Product',
        id: idMatch ? idMatch[1] : 'unknown',
        name: nameMatch[1],
        image: imageMatch[1]
      });
    }
  }
}

// Parse Featured and Chef recommendations
const extraItems = [];
const featuredMatch = menuContent.match(/export const FEATURED_DISHES = \[\s*([\s\S]*?)\s*\];/);
if (featuredMatch) {
  const blocks = featuredMatch[1].match(/\{[\s\S]*?\}/g) || [];
  for (const block of blocks) {
    const nameMatch = block.match(/title:\s*['"`]([^'"`]+)['"`]/);
    const imageMatch = block.match(/image:\s*['"`]([^'"`]+)['"`]/);
    if (nameMatch && imageMatch) {
      extraItems.push({ type: 'Featured Dish', name: nameMatch[1], image: imageMatch[1] });
    }
  }
}

const chefRecsMatch = menuContent.match(/export const CHEF_RECOMMENDATIONS = \[\s*([\s\S]*?)\s*\];/);
if (chefRecsMatch) {
  const blocks = chefRecsMatch[1].match(/\{[\s\S]*?\}/g) || [];
  for (const block of blocks) {
    const nameMatch = block.match(/name:\s*['"`]([^'"`]+)['"`]/);
    const imageMatch = block.match(/image:\s*['"`]([^'"`]+)['"`]/);
    if (nameMatch && imageMatch) {
      extraItems.push({ type: 'Chef Recommendation', name: nameMatch[1], image: imageMatch[1] });
    }
  }
}

const allAssets = [...categories, ...items, ...extraItems];

console.log(`\nFound ${categories.length} categories, ${items.length} products, and ${extraItems.length} promotional items.\n`);

const results = {
  localExist: [],
  localMissing: [],
  external: []
};

for (const entry of allAssets) {
  const imgPath = entry.image;
  
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    results.external.push(entry);
  } else {
    // Resolve local path relative to frontend/public
    const fullPath = path.join(publicDir, imgPath);
    const exists = fs.existsSync(fullPath);
    if (exists) {
      const stats = fs.statSync(fullPath);
      if (stats.size > 0) {
        results.localExist.push({ ...entry, fullPath, size: stats.size });
      } else {
        results.localMissing.push({ ...entry, fullPath, reason: 'Empty file (0 bytes)' });
      }
    } else {
      results.localMissing.push({ ...entry, fullPath, reason: 'File does not exist' });
    }
  }
}

console.log('=== IMAGE AUDIT REPORT ===\n');
console.log(`Local Images Found & Valid: ${results.localExist.length}`);
console.log(`Local Images Missing/Invalid: ${results.localMissing.length}`);
console.log(`External/Unsplash Images: ${results.external.length}`);
console.log('==========================\n');

if (results.localMissing.length > 0) {
  console.log('❌ MISSING LOCAL IMAGES:');
  results.localMissing.forEach(item => {
    console.log(`  - [${item.type}] ${item.name} (${item.id}): "${item.image}" -> Reason: ${item.reason}`);
  });
  console.log('');
} else {
  console.log('✅ All referenced local images exist on disk!\n');
}

if (results.external.length > 0) {
  console.log('🔗 EXTERNAL (UNSPLASH) IMAGES:');
  results.external.forEach(item => {
    console.log(`  - [${item.type}] ${item.name}: "${item.image}"`);
  });
}
