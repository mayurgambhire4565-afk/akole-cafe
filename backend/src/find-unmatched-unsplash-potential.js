const fs = require('fs');
const path = require('path');

const menuFilePath = path.join(__dirname, 'maharashtraMenu.ts');
const imagePoolPath = path.join(__dirname, '../image-pool.json');

if (!fs.existsSync(menuFilePath)) {
  console.error(`Error: Menu file not found at ${menuFilePath}`);
  process.exit(1);
}

let imagePool = {};
if (fs.existsSync(imagePoolPath)) {
  try {
    imagePool = JSON.parse(fs.readFileSync(imagePoolPath, 'utf8'));
  } catch (e) {
    console.error(`Warning: Failed to parse image pool from ${imagePoolPath}`);
  }
} else {
  console.log(`Warning: Image pool not found at ${imagePoolPath}. Suggestions will be limited.`);
}

console.log(`Reading menu file: ${menuFilePath}`);
const menuContent = fs.readFileSync(menuFilePath, 'utf8');

// Parse items from inventoryByCategory
const items = [];
const itemsTextStart = menuContent.indexOf('const inventoryByCategory');
if (itemsTextStart !== -1) {
  const itemsTextEnd = menuContent.indexOf('];', itemsTextStart);
  const itemsText = menuContent.substring(itemsTextStart, itemsTextEnd + 2);
  
  // Parse categories first to map items to their categories
  const catBlocks = itemsText.match(/\{[\s\S]*?categoryId:\s*['"`]([^'"`]+)['"`][\s\S]*?items:\s*\[/g) || [];
  
  // Alternatively, do a structure-aware parse
  const categorySections = itemsText.split(/categoryId:\s*/).slice(1);
  for (const sec of categorySections) {
    const catIdMatch = sec.match(/^['"`]([^'"`]+)['"`]/);
    if (!catIdMatch) continue;
    const catId = catIdMatch[1];
    
    // Find all item blocks inside this section
    const itemsBlockMatch = sec.match(/items:\s*\[([\s\S]*?)\]\s*(,\s*\}|\})/);
    if (itemsBlockMatch) {
      const itemsText = itemsBlockMatch[1];
      const itemBlocks = itemsText.match(/\{[\s\S]*?\}/g) || [];
      for (const block of itemBlocks) {
        const idMatch = block.match(/id:\s*['"`]([^'"`]+)['"`]/);
        const nameMatch = block.match(/name:\s*['"`]([^'"`]+)['"`]/);
        const imageMatch = block.match(/image:\s*['"`]([^'"`]+)['"`]/);
        if (nameMatch && imageMatch) {
          items.push({
            id: idMatch ? idMatch[1] : 'unknown',
            name: nameMatch[1],
            image: imageMatch[1],
            categoryId: catId
          });
        }
      }
    }
  }
}

// Find items that have external Unsplash URLs
const unsplashItems = items.filter(item => 
  item.image.includes('unsplash.com')
);

console.log(`\nFound ${unsplashItems.length} items currently using Unsplash URLs.\n`);

function suggestPoolCategory(itemName, categoryId) {
  const nameLower = itemName.toLowerCase();
  
  if (nameLower.includes('cheesecake')) return 'cheesecake';
  if (nameLower.includes('brownie')) return 'brownie';
  if (nameLower.includes('pastry')) return 'pastry';
  if (nameLower.includes('ice cream') || nameLower.includes('scoop') || nameLower.includes('float')) return 'ice cream';
  if (nameLower.includes('sundae')) return 'sundae';
  if (nameLower.includes('sandwich') || nameLower.includes('toast')) return 'sandwich';
  if (nameLower.includes('mocktail') || nameLower.includes('mojito') || nameLower.includes('lagoon')) return 'mocktail';
  if (nameLower.includes('cold coffee') || nameLower.includes('cold brew') || nameLower.includes('frappe')) return 'cold coffee';
  if (nameLower.includes('coffee') || nameLower.includes('espresso') || nameLower.includes('latte') || nameLower.includes('cappuccino')) return 'hot coffee';
  
  // Fallbacks by categoryId
  if (categoryId === 'desserts') return 'cheesecake'; // generic fallback for desserts
  if (categoryId === 'beverages') return 'mocktail';
  
  return null;
}

if (unsplashItems.length > 0) {
  console.log('=== UNMATCHED UNSPLASH ITEMS & SUGGESTIONS ===\n');
  
  unsplashItems.forEach((item, index) => {
    console.log(`${index + 1}. Item: "${item.name}" (ID: ${item.id}, Category: ${item.categoryId})`);
    console.log(`   Current URL: ${item.image}`);
    
    const poolCat = suggestPoolCategory(item.name, item.categoryId);
    if (poolCat && imagePool[poolCat] && imagePool[poolCat].length > 0) {
      console.log(`   Suggested category in pool: "${poolCat}"`);
      console.log(`   Top 3 replacement options from pool:`);
      imagePool[poolCat].slice(0, 3).forEach((url, i) => {
        console.log(`     [Option ${i + 1}]: ${url}`);
      });
    } else {
      console.log(`   Suggested category in pool: None matched. Consider fetching images for a new query.`);
    }
    console.log('--------------------------------------------------');
  });
} else {
  console.log('🎉 No items are currently using Unsplash URLs. All items use local assets!');
}
