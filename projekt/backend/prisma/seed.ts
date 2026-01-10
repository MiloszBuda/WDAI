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
  const hashedAdmin = await bcrypt.hash("admin123", 10);
  const hashedUser = await bcrypt.hash("1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      username: "admin",
      password: hashedAdmin,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@user.com" },
    update: {},
    create: {
      email: "user@user.com",
      username: "user",
      password: hashedUser,
      role: "user",
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
