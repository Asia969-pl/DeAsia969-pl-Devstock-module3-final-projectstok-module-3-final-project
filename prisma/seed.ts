import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {

  await prisma.cardItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.card.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();



  await prisma.brand.createMany({
    data: [
      { name: "ROG", image: "https://i.ibb.co/gF6DWXjm/ROG-Logo.png" },
      {
        name: "Logitech",
        image: "https://i.ibb.co/Gv25dhby/Logitech-Logo.png",
      },
      { name: "JBL", image: "https://i.ibb.co/BhWzpj1/JBL-Logo.png" },
      { name: "AOC", image: "https://i.ibb.co/ZRknD5Y0/AOC-Logo.png" },
      { name: "Razer", image: "https://i.ibb.co/v44v488d/Razer-Logo.png" },
      { name: "Rexus", image: "https://i.ibb.co/gLCdQL55/Rexus-Logo.png" },
    ],
  });

  const brands = await prisma.brand.findMany();

  // ✅ Tworzymy kategorie
  await prisma.category.createMany({
    data: [
      {
        name: "Mouse",
        categoryImage: "https://i.ibb.co/yF3gNPqK/category-Mouse.png",
        categoryDescription: "mouse",
        categoryCarouselImage: "https://i.ibb.co/DgftyNT1/corousel-Mouse.png",
        categoryInfo:
          "Explore our diverse selection of electronic mice for sale, featuring cutting-edge technology, ergonomic designs, and unbeatable prices. Shop now!",
      },
      {
        name: "Keyboard",
        categoryImage: "https://i.ibb.co/JRTFqq5r/category-Keyboard.png",
        categoryDescription: "keyboard",
        categoryCarouselImage:
          "https://i.ibb.co/ynDfvp9f/carousel-Keyboard.jpg",
        categoryInfo:
          "Explore our diverse selection of electronic mice for sale, featuring cutting-edge technology, ergonomic designs, and unbeatable prices. Shop now!",
      },
      {
        name: "Headphone",
        categoryImage: "https://i.ibb.co/0jmCmbc5/category-Head-Phones.png",
        categoryDescription: "headphones",
        categoryCarouselImage:
          "https://i.ibb.co/YCKm04n/carousel-Headphone.jpg",
        categoryInfo:
          "Explore our diverse selection of electronic mice for sale, featuring cutting-edge technology, ergonomic designs, and unbeatable prices. Shop now!",
      },
      {
        name: "Monitor",
        categoryImage: "https://i.ibb.co/vCKYHNdj/categoty-Monitor.png",
        categoryDescription: "monitor",
        categoryCarouselImage: "https://i.ibb.co/TB9mkzLT/Carousel-Monitor.jpg",
        categoryInfo:
          "Explore our diverse selection of electronic mice for sale, featuring cutting-edge technology, ergonomic designs, and unbeatable prices. Shop now!",
      },
      {
        name: "Webcam",
        categoryImage: "https://i.ibb.co/FfmtJnR/category-Camera.png",
        categoryDescription: "webcam",
        categoryCarouselImage: "https://i.ibb.co/chGmrqvn/carousel-Camera.jpg",
        categoryInfo:
          "Explore our diverse selection of electronic mice for sale, featuring cutting-edge technology, ergonomic designs, and unbeatable prices. Shop now!",
      },
      {
        name: "Others",
        categoryImage: "https://i.ibb.co/yF3gNPqK/category-Mouse.png",
        categoryDescription: "others",
        categoryCarouselImage: "https://i.ibb.co/DgftyNT1/corousel-Mouse.png",
        categoryInfo:
          "Explore our diverse selection of electronic mice for sale, featuring cutting-edge technology, ergonomic designs, and unbeatable prices. Shop now!s",
      },
    ],
  });

  const categories = await prisma.category.findMany();

  // ✅ Tworzymy użytkowników
  await prisma.user.createMany({
    data: [
      {
        picture: "https://i.ibb.co/PvWrtkmt/avatar.png",
        name: "Sara Connor",
        email: "sara@example.com",
        password: "kkkkkk",
        phone: "693203560",
        country: "Polska",
      },
      {
        picture: "https://i.ibb.co/PvWrtkmt/avatar.png",
        name: "Sandra Connor",
        email: "sandra@example.com",
        password: "111111111",
        phone: " 698203856",
        country: "Polska",
      },
      {
        picture: "https://i.ibb.co/PvWrtkmt/avatar.png",
        name: "Anna Connor",
        email: "anna@example.com",
        password: "k4444kkkk",
        phone: "697207567",
        country: "Polska",
      },
      {
        picture: "https://i.ibb.co/PvWrtkmt/avatar.png",
        name: "Dorota Connor",
        email: "dorota@example.com",
        password: "k451",
        phone: "699209568",
        country: "Polska",
      },
      {
        picture: "https://i.ibb.co/PvWrtkmt/avatar.png",
        name: "Sola Connor",
        email: "sola@example.com",
        password: "k857kkk",
        phone: "691202563",
        country: "Polska",
      },
    ],
  });

  const users = await prisma.user.findMany();

  // ✅ Tworzymy produkty
  await prisma.product.createMany({
    data: [
      {
        name: "Rexus Xierra X16",
        description: "Rexus Xierra X16 hjjmbghkhbj,jughghjhjjhhjghjhhjhhhhjgggggggggggggggjkl;lolihyk./;ligggsdsskkll;ffdrttty",
        price: 25.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/ZpXzMwK1/mouse2.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Rexus")!.id,
      },
      {
        name: "Logitech G213 Prodigy",
        description: "Logitech G213 Prodigy",
        price: 49.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/vxgFq8VT/keyboard.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Keyboard")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Logitech G502 Hero",
        description: "Logitech G502 Hero",
        price: 34.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/dFPB13q/mouse.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Sony WH-CH510",
        description: "Sony WH-CH510",
        price: 59.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/4ZdLhP6R/headphones.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Headphone")!.id,
        brandId: brands.find((b) => b.name === "JBL")!.id,
      },
      {
        name: "AOC 24G2E",
        description: "AOC 24G2E",
        price: 209.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/kgNTFX0R/monitor1.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Monitor")!.id,
        brandId: brands.find((b) => b.name === "AOC")!.id,
      },
      {
        name: "Rexus Xierra X17",
        description: "Rexus Xierra X17",
        price: 25.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/ZpXzMwK1/mouse2.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Rexus")!.id,
      },
      {
        name: "Logitech G2155 Prodigy",
        description: "Logitech G213 Prodigy",
        price: 49.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/vxgFq8VT/keyboard.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Keyboard")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Logitech G5000 Hero",
        description: "Logitech G502 Hero",
        price: 34.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/dFPB13q/mouse.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Sony WH-CH5101",
        description: "Sony WH-CH510",
        price: 59.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/4ZdLhP6R/headphones.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Headphone")!.id,
        brandId: brands.find((b) => b.name === "JBL")!.id,
      },
      {
        name: "AOC 24G2EAAA",
        description: "AOC 24G2E",
        price: 209.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/kgNTFX0R/monitor1.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Monitor")!.id,
        brandId: brands.find((b) => b.name === "AOC")!.id,
      },
      {
        name: "Rexus Xierra X18",
        description: "Rexus Xierra X16",
        price: 25.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/ZpXzMwK1/mouse2.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Rexus")!.id,
      },
      {
        name: "Logitech G24444 Prodigy",
        description: "Logitech G213 Prodigy",
        price: 49.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/vxgFq8VT/keyboard.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Others")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Logitech G5021010 Hero",
        description: "Logitech G502 Hero",
        price: 34.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/dFPB13q/mouse.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Sony WH-CH5104561",
        description: "Sony WH-CH510",
        price: 59.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/4ZdLhP6R/headphones.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Headphone")!.id,
        brandId: brands.find((b) => b.name === "JBL")!.id,
      },
      {
        name: "AOC 24G2E45214",
        description: "AOC 24G2E",
        price: 209.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/kgNTFX0R/monitor1.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Others")!.id,
        brandId: brands.find((b) => b.name === "AOC")!.id,
      },
      {
        name: "Rexus Xierra X70",
        description: "Rexus Xierra X16",
        price: 25.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/ZpXzMwK1/mouse2.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Rexus")!.id,
      },
      {
        name: "Logitech G2456 Prodigy",
        description: "Logitech G213 Prodigy",
        price: 49.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/vxgFq8VT/keyboard.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Others")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Logitech G544401 Hero",
        description: "Logitech G502 Hero",
        price: 34.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/dFPB13q/mouse.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Sony WH-CH51000",
        description: "Sony WH-CH510",
        price: 59.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/4ZdLhP6R/headphones.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Others")!.id,
        brandId: brands.find((b) => b.name === "JBL")!.id,
      },
      {
        name: "AOC 24G2E101",
        description: "AOC 24G2E",
        price: 209.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/kgNTFX0R/monitor1.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Monitor")!.id,
        brandId: brands.find((b) => b.name === "AOC")!.id,
      },
      {
        name: "Rexus Xierra X42",
        description: "Rexus Xierra X16",
        price: 25.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/ZpXzMwK1/mouse2.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Rexus")!.id,
      },
      {
        name: "Logitech G241 Prodigy",
        description: "Logitech G213 Prodigy",
        price: 49.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/vxgFq8VT/keyboard.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Keyboard")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Logitech G5456 Hero",
        description: "Logitech G502 Hero",
        price: 34.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/dFPB13q/mouse.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Sony WH-CH5111",
        description: "Sony WH-CH510",
        price: 59.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/4ZdLhP6R/headphones.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Headphone")!.id,
        brandId: brands.find((b) => b.name === "JBL")!.id,
      },
      {
        name: "AOC 24G452",
        description: "AOC 24G2E",
        price: 209.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/kgNTFX0R/monitor1.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Monitor")!.id,
        brandId: brands.find((b) => b.name === "AOC")!.id,
      },
      {
        name: "Rexus Xierra X25",
        description: "Rexus Xierra X16",
        price: 25.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/ZpXzMwK1/mouse2.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Rexus")!.id,
      },
      {
        name: "Logitech G225 Prodigy",
        description: "Logitech G213 Prodigy",
        price: 49.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/vxgFq8VT/keyboard.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Keyboard")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Logitech G5555 Hero",
        description: "Logitech G502 Hero",
        price: 34.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/dFPB13q/mouse.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Mouse")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      },
      {
        name: "Sony WH-CH5100045",
        description: "Sony WH-CH510",
        price: 59.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/4ZdLhP6R/headphones.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Headphone")!.id,
        brandId: brands.find((b) => b.name === "JBL")!.id,
      },
      {
        name: "AOC 24G2225E",
        description: "AOC 24G2E",
        price: 209.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/kgNTFX0R/monitor1.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Monitor")!.id,
        brandId: brands.find((b) => b.name === "AOC")!.id,
      },
      {
        name: "webcam2",
        description: "Webcam26",
        price: 25.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/ZpXzMwK1/mouse2.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Webcam")!.id,
        brandId: brands.find((b) => b.name === "Rexus")!.id,
      },
      {
        name: "Webcam1",
        description: "Logitech G213 Prodigy",
        price: 49.99,
        stock: 10,
        imageUrl: "https://i.ibb.co/vxgFq8VT/keyboard.png",
        imageUrlFirst: "https://i.ibb.co/CKfQgZ5Q/product2.jpg",
        imageUrlSecond: "https://i.ibb.co/5WdYXFby/product1.jpg",
        categoryId: categories.find((c) => c.name === "Webcam")!.id,
        brandId: brands.find((b) => b.name === "Logitech")!.id,
      }
    ],
  });


  console.log("✅ Seed completed");
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
