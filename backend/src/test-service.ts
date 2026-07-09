import * as productService from './services/product.service';

async function test() {
  const result = await productService.getProducts({
    page: 1,
    limit: 12,
    category: 'sandwiches',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  console.log('Service result products count:', result.products.length);
  console.log('Service pagination:', result.pagination);
}

test().catch(console.error);
