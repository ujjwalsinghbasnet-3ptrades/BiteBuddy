import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.menuItem.deleteMany();

  // Create menu items
  const menuItems = [
    {
      name: "Classic Cheeseburger",
      description:
        "Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce on a toasted bun.",
      price: 9.99,
      image:
        "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Burgers",
      popularity: 95,
    },
    {
      name: "Margherita Pizza",
      description:
        "Traditional pizza with tomato sauce, fresh mozzarella, basil, and olive oil on our house-made crust.",
      price: 12.99,
      image:
        "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Pizza",
      popularity: 90,
    },
    {
      name: "Spicy Buffalo Wings",
      description:
        "Crispy chicken wings tossed in our signature buffalo sauce, served with celery and blue cheese dip.",
      price: 10.99,
      image:
        "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Appetizers",
      popularity: 85,
    },
    {
      name: "Caesar Salad",
      description:
        "Crisp romaine lettuce with parmesan cheese, croutons, and our creamy Caesar dressing.",
      price: 8.99,
      image:
        "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Salads",
      popularity: 75,
    },
    {
      name: "Grilled Salmon",
      description:
        "Fresh Atlantic salmon fillet grilled to perfection, served with seasonal vegetables and lemon herb sauce.",
      price: 16.99,
      image:
        "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Mains",
      popularity: 80,
    },
    {
      name: "Chocolate Lava Cake",
      description:
        "Warm chocolate cake with a molten center, served with vanilla ice cream and fresh berries.",
      price: 7.99,
      image:
        "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Desserts",
      popularity: 88,
    },
    {
      name: "Veggie Wrap",
      description:
        "Grilled vegetables, hummus, and mixed greens wrapped in a whole wheat tortilla.",
      price: 8.99,
      image:
        "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Sandwiches",
      popularity: 70,
    },
    {
      name: "Chicken Alfredo Pasta",
      description:
        "Fettuccine pasta in a creamy Alfredo sauce with grilled chicken and parmesan cheese.",
      price: 14.99,
      image:
        "https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Pasta",
      popularity: 82,
    },
    {
      name: "Loaded Nachos",
      description:
        "Crispy tortilla chips topped with melted cheese, jalapeños, black beans, sour cream, and guacamole.",
      price: 11.99,
      image:
        "https://images.pexels.com/photos/1108775/pexels-photo-1108775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Appetizers",
      popularity: 78,
    },
    {
      name: "Fresh Fruit Smoothie",
      description: "Blend of seasonal fruits with yogurt and honey.",
      price: 5.99,
      image:
        "https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Drinks",
      popularity: 65,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
    console.log({ seeding: item.name });
  }

  console.log("Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
