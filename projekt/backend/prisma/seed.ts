import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedProductsFromFakeStore() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
      },
    });
  }
}

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      username: "admin",
      password: hashed,
      role: "admin",
    },
  });

  await seedProductsFromFakeStore();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
