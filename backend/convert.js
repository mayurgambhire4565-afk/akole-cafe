const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/provider = "mysql"/g, 'provider = "sqlite"');
schema = schema.replace(/url\s+=\s+env\("DATABASE_URL"\)/g, 'url      = "file:./dev.db"');
schema = schema.replace(/enum \w+ \{[^}]+\}/g, '');

const enums = ['Role', 'OrderStatus', 'PaymentStatus', 'PaymentProvider', 'SubscriptionPlan', 'SubscriptionStatus', 'RewardType', 'CouponType', 'NotificationType'];
enums.forEach(e => {
  schema = schema.replace(new RegExp(`\\b${e}\\b`, 'g'), 'String');
});

schema = schema.replace(/@default\(([^)]+)\)/g, (match, p1) => {
  if (['now', 'autoincrement', 'uuid', 'cuid', 'true', 'false'].some(k => p1.includes(k)) || !isNaN(p1) || p1.startsWith('"') || p1.startsWith("'")) {
    return match;
  }
  return `@default("${p1.trim()}")`;
});

schema = schema.replace(/@db\.\w+(\([^)]+\))?/g, '');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log("Converted successfully!");
