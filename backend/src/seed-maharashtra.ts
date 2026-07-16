import prisma from './database/prisma';
import { MENU_CATEGORIES, MENU_ITEMS } from './maharashtraMenu';

async function main() {
  console.log('Seeding database with Maharashtra Menu...');

  // Clear existing database records to prevent duplicate constraints
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Seed Categories
  for (const cat of MENU_CATEGORIES) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || '',
        isActive: true,
        sortOrder: 0,
      }
    });
  }
  console.log('Categories seeded successfully');

  // 2. Seed Products
  for (const prod of MENU_ITEMS) {
    // If images is a string, it's already serialized, else it's an array
    const imagesJson = prod.images;
    
    await prisma.product.create({
      data: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description || '',
        shortDesc: prod.shortDesc || '',
        price: prod.price,
        stock: prod.stock || 100,
        images: imagesJson,
        categoryId: prod.categoryId,
        rating: prod.rating || 0,
        reviewCount: prod.reviewCount || 0,
        isActive: true,
        isFeatured: prod.isFeatured || false,
        isBestseller: prod.isBestseller || false,
        isVeg: prod.isVeg ?? true,
        isChefSpecial: prod.isChefSpecial ?? false,
        spiceLevel: prod.spiceLevel || null,
        prepTime: prod.prepTime || '15 mins',
      }
    });
  }
  console.log('Products seeded successfully');
  console.log('Database seeded with Maharashtra Menu successfully! ☕🌱');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
