import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.tag.createMany({
    data: [
      { title: "vegan" },
      { title: "vegetarian" },
      { title: "gluten-free" },
      { title: "dairy-free" },
      { title: "hearty" },
    ],
  });
  await prisma.food.createMany({
    data: [
      {
        creator: "Chef Bob",
        name: "Pizza",
        description: "A delicious pizza with tomatoes and mozzarella.",
      },
      {
        creator: "Chef Nancy",
        name: "Pasta",
        description: "A heavy pasta with cream sauce.",
      },
      {
        creator: "Chef Benjamin",
        name: "Salad",
        description: "A light salad with lettuce and tomatoes.",
      },
      {
        creator: "Chef Linus",
        name: "Burger",
        description: "A hearty burger with beef and cheese.",
      },
    ],
  });

  // add a random tag to every food
  const food = await prisma.food.findMany();
  const tags = await prisma.tag.findMany();

  for (const foodItem of food) {
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    if (!randomTag) {
      throw new Error("no random tag");
    }
    await prisma.food.update({
      data: {
        Tags: {
          connect: {
            id: randomTag.id,
          },
        },
      },
      where: {
        id: foodItem.id,
      },
    });
  }
}

main()
  .then(async () => {
    console.log("done seeding db");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
