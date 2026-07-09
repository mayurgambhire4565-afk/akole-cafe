const fs = require('fs');
const path = require('path');

const dashboardPages = ['DashboardHome', 'ProfilePage', 'OrdersPage', 'OrderDetailPage', 'WishlistPage', 'AddressesPage', 'SubscriptionsPage', 'RewardsPage', 'CouponsPage', 'NotificationsPage'];
const adminPages = ['AdminDashboard', 'AdminProducts', 'AdminCategories', 'AdminOrders', 'AdminUsers', 'AdminBlogs', 'AdminCoupons', 'AdminReviews', 'AdminSubscriptions', 'AdminRewards'];
const layoutPages = ['DashboardLayout', 'AdminLayout', 'AuthLayout', 'MainLayout'];

function createComponents(dir, pages) {
  let dirPath = path.join('c:/Users/MAYUR/Desktop/Akole Cafe/frontend/src', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  pages.forEach(page => {
    const filePath = path.join(dirPath, `${page}.tsx`);
    if (!fs.existsSync(filePath)) {
      let isLayout = dir === 'layouts';
      const content = `import { Outlet } from 'react-router-dom';\n\nexport default function ${page}() {\n  return (\n    <div className="p-6">\n      <h1 className="text-2xl font-bold mb-4">${page.replace(/([A-Z])/g, ' $1').trim()}</h1>\n      ${isLayout ? '<Outlet />' : '<p>This page is under construction.</p>'}\n    </div>\n  );\n}\n`;
      fs.writeFileSync(filePath, content);
    }
  });
}

createComponents('pages/dashboard', dashboardPages);
createComponents('pages/admin', adminPages);
createComponents('layouts', layoutPages);

console.log('Pages generated!');
