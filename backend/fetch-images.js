const fs = require('fs');

const queries = ['cheesecake', 'brownie', 'pastry', 'ice cream', 'sundae', 'sandwich', 'mocktail', 'cold coffee'];
const imagePool = {};

async function fetchImages(query) {
    try {
        const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=30`);
        const json = await res.json();
        return json.results.map(r => r.urls.regular);
    } catch(e) {
        console.error('Error fetching', query, e);
        return [];
    }
}

async function main() {
    for (const q of queries) {
        imagePool[q] = await fetchImages(q);
        console.log(`Fetched ${imagePool[q].length} for ${q}`);
    }
    fs.writeFileSync('image-pool.json', JSON.stringify(imagePool, null, 2));
}

main();
