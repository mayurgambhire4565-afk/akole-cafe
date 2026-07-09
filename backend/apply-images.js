const fs = require('fs');

const seedFile = 'src/seed-menu.ts';
let content = fs.readFileSync(seedFile, 'utf8');

const imagePool = JSON.parse(fs.readFileSync('image-pool.json', 'utf8'));

const indexMap = {
    'cheesecake': 0,
    'brownie': 0,
    'pastry': 0,
    'ice cream': 0,
    'sundae': 0,
    'sandwich': 0,
    'mocktail': 0,
    'cold coffee': 0
};

function getNextImage(category) {
    if (!imagePool[category]) return null;
    const urls = imagePool[category];
    const idx = indexMap[category];
    if (idx < urls.length) {
        indexMap[category]++;
        return urls[idx];
    }
    // Loop if exhausted
    indexMap[category] = 1;
    return urls[0];
}

// Find each product block and replace images if it's an unsplash URL
const blockRegex = /name:\s*'([^']+)',[\s\S]*?images:\s*\['(https:\/\/images\.unsplash\.com[^']+)'\]/g;

content = content.replace(blockRegex, (match, name, oldUrl) => {
    let category = null;
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('cheesecake')) category = 'cheesecake';
    else if (lowerName.includes('brownie')) category = 'brownie';
    else if (lowerName.includes('pastry')) category = 'pastry';
    else if (lowerName.includes('ice cream') || lowerName.includes('scoop') || lowerName.includes('float')) category = 'ice cream';
    else if (lowerName.includes('sundae')) category = 'sundae';
    else if (lowerName.includes('sandwich') || lowerName.includes('toast')) category = 'sandwich';
    else if (lowerName.includes('mocktail') || lowerName.includes('mojito') || lowerName.includes('lagoon')) category = 'mocktail';
    else if (lowerName.includes('cold coffee') || lowerName.includes('cold brew')) category = 'cold coffee';
    
    if (category) {
        const newUrl = getNextImage(category);
        if (newUrl) {
            console.log(`Replaced image for ${name} using ${category}`);
            return match.replace(oldUrl, newUrl);
        }
    }
    
    return match; // fallback
});

// Also replace category images
const catRegex = /id:\s*'cat-([^']+)',[\s\S]*?name:\s*'([^']+)',[\s\S]*?image:\s*'(https:\/\/images\.unsplash\.com[^']+)'/g;
content = content.replace(catRegex, (match, id, name, oldUrl) => {
    let category = null;
    if (id === 'hot-coffee') category = 'hot coffee';
    else if (id === 'cold-coffee') category = 'cold coffee';
    else if (id === 'desserts') category = 'cheesecake';
    else if (id === 'ice-cream') category = 'ice cream';
    else if (id === 'sandwiches') category = 'sandwich';
    else if (id === 'mocktails') category = 'mocktail';
    
    if (category) {
        const newUrl = getNextImage(category);
        if (newUrl) {
            console.log(`Replaced category image for ${name}`);
            return match.replace(oldUrl, newUrl);
        }
    }
    return match;
});

fs.writeFileSync(seedFile, content, 'utf8');
console.log("Done updating seed-menu.ts");
