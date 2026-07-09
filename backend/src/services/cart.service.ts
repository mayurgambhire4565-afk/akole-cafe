import prisma from '../database/prisma';

export const getCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, salePrice: true, images: true, stock: true, slug: true },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, salePrice: true, images: true, stock: true, slug: true },
            },
          },
        },
      },
    });
  }

  return cart;
};

export const addToCart = async (userId: string, productId: string, quantity = 1) => {
  const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) throw new Error('Insufficient stock');

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (product.stock < newQty) throw new Error('Insufficient stock');
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
  }

  return getCart(userId);
};

export const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
  if (quantity <= 0) return removeFromCart(userId, itemId);

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
    include: { product: true },
  });

  if (!item) throw new Error('Cart item not found');
  if (item.product.stock < quantity) throw new Error('Insufficient stock');

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  return getCart(userId);
};

export const removeFromCart = async (userId: string, itemId: string) => {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
  });
  if (!item) throw new Error('Cart item not found');

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
};

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
};
