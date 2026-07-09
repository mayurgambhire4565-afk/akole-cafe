import prisma from './database/prisma';

async function test() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        slug: 'sandwiches'
      }
    },
    include: {
      category: true
    }
  });
  console.log('Products count for category "sandwiches":', products.length);
  if (products.length > 0) {
    console.log('First product category details:', products[0].category);
  }

  const allCategories = await prisma.category.findMany({});
  console.log('All categories:', allCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug })));

  const allProducts = await prisma.product.findMany({
    take: 5,
    include: { category: true }
  });
  console.log('Sample products:', allProducts.map(p => ({ name: p.name, categoryName: p.category.name, categorySlug: p.category.slug })));
}

test().catch(console.error);
