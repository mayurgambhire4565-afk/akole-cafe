import prisma from './database/prisma';

async function main() {
  console.log('Seeding database with parsed arrays...');

  // Clear existing data (optional, but good for clean state)
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Create Categories
  const hotCoffeeCat = await prisma.category.create({
    data: {
      id: 'cat-hot-coffee',
      name: 'Hot Coffee',
      slug: 'hot-coffee',
      description: 'Freshly brewed hot espresso and coffee drinks.',
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&q=80',
      isActive: true,
      sortOrder: 1,
    },
  });

  const coldCoffeeCat = await prisma.category.create({
    data: {
      id: 'cat-cold-coffee',
      name: 'Cold Coffee & Brews',
      slug: 'cold-coffee-brews',
      description: 'Refreshing iced coffees and slow-steeped cold brews.',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80',
      isActive: true,
      sortOrder: 2,
    },
  });

  const dessertsCat = await prisma.category.create({
    data: {
      id: 'cat-desserts',
      name: 'Desserts',
      slug: 'desserts',
      description: 'Delicious flaky pastries and sweet treats.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
      isActive: true,
      sortOrder: 3,
    },
  });

  console.log('Categories created successfully');

  // 2. Create Products
  const products = [
    {
      id: '1',
      name: 'Classic Espresso',
      slug: 'classic-espresso',
      description: 'Bold, rich, and full of character, crafted with carefully roasted beans.',
      shortDesc: 'Bold, rich, and full of character, crafted with carefully roasted beans.',
      price: 150,
      stock: 100,
      images: ['/classic-espresso.png'],
      categoryId: hotCoffeeCat.id,
      rating: 4.8,
      reviewCount: 15,
      isActive: true,
      isFeatured: true,
      isBestseller: true,
      roastLevel: 'Medium-Dark',
      origin: 'Chikmagalur',
      flavor: 'Chocolate, Caramel',
    },
    {
      id: '2',
      name: 'Caramel Macchiato',
      slug: 'caramel-macchiato',
      description: 'Sweet indulgence with a hint of vanilla and caramel drizzle.',
      shortDesc: 'Sweet indulgence with a hint of vanilla and caramel drizzle.',
      price: 180,
      stock: 100,
      images: ['/caramel-macchiato.png'],
      categoryId: hotCoffeeCat.id,
      rating: 4.9,
      reviewCount: 22,
      isActive: true,
      isFeatured: true,
      isBestseller: true,
      roastLevel: 'Medium',
      origin: 'Araku Valley',
      flavor: 'Vanilla, Caramel, Creamy',
    },
    {
      id: '3',
      name: 'Hazelnut Latte',
      slug: 'hazelnut-latte',
      description: 'Smooth, nutty, and wonderfully warm for a cozy afternoon.',
      shortDesc: 'Smooth, nutty, and wonderfully warm for a cozy afternoon.',
      price: 160,
      stock: 100,
      images: ['/hazelnut-latte.png'],
      categoryId: hotCoffeeCat.id,
      rating: 4.7,
      reviewCount: 18,
      isActive: true,
      isFeatured: true,
      isBestseller: true,
      roastLevel: 'Medium',
      origin: 'Nilgiris',
      flavor: 'Roasted Hazelnut, Milky',
    },
    {
      id: '4',
      name: 'Iced Americano',
      slug: 'iced-americano',
      description: 'Refreshingly cool and bold, perfect for beating the heat.',
      shortDesc: 'Refreshingly cool and bold, perfect for beating the heat.',
      price: 140,
      stock: 100,
      images: ['/iced-americano.png'],
      categoryId: coldCoffeeCat.id,
      rating: 4.6,
      reviewCount: 14,
      isActive: true,
      isFeatured: true,
      isBestseller: true,
      roastLevel: 'Dark',
      origin: 'Chikmagalur',
      flavor: 'Bold Cocoa, Smoky',
    },
    {
      id: '5',
      name: 'Cafe Cappuccino',
      slug: 'cafe-cappuccino',
      description: 'Classic cappuccino with equal parts espresso, steamed milk, and rich milk foam.',
      shortDesc: 'Classic cappuccino with equal parts espresso, steamed milk, and rich milk foam.',
      price: 170,
      stock: 100,
      images: ['/cafe-cappuccino.png'],
      categoryId: hotCoffeeCat.id,
      rating: 4.6,
      reviewCount: 12,
      isActive: true,
      isFeatured: false,
      isBestseller: false,
      roastLevel: 'Medium-Dark',
      origin: 'Nilgiris',
      flavor: 'Rich, Frothy, Balanced',
    },
    {
      id: '6',
      name: 'Cold Brew Reserve',
      slug: 'cold-brew-reserve',
      description: 'Slow-steeped for 20 hours, resulting in a super smooth, low-acid coffee served cold.',
      shortDesc: 'Slow-steeped for 20 hours, resulting in a super smooth, low-acid coffee.',
      price: 190,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80'],
      categoryId: coldCoffeeCat.id,
      rating: 4.9,
      reviewCount: 25,
      isActive: true,
      isFeatured: true,
      isBestseller: false,
      roastLevel: 'Medium',
      origin: 'Araku Valley',
      flavor: 'Blueberry, Chocolate, Clean Finish',
    },
    {
      id: '7',
      name: 'Chocolate Croissant',
      slug: 'chocolate-croissant',
      description: 'Flaky, buttery pastry filled with premium Belgian dark chocolate.',
      shortDesc: 'Flaky, buttery pastry filled with rich dark chocolate.',
      price: 120,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80'],
      categoryId: dessertsCat.id,
      rating: 4.8,
      reviewCount: 30,
      isActive: true,
      isFeatured: false,
      isBestseller: false,
    },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        shortDesc: prod.shortDesc,
        price: prod.price,
        stock: prod.stock,
        images: prod.images,
        categoryId: prod.categoryId,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
        isBestseller: prod.isBestseller,
        roastLevel: prod.roastLevel,
        origin: prod.origin,
        flavor: prod.flavor,
      },
    });
  }

  console.log('Products created successfully');
  console.log('Database seeded successfully! 🌱');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
