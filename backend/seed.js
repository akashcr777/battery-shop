require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const connectDB = require("./config/db");

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (only products, keep users)
    // Uncomment the line below ONLY if you want to delete all users
    // await User.deleteMany({});
    await Product.deleteMany({});
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@pilotbattery.com" });

    // Create admin user (only if doesn't exist)
    if (!existingAdmin) {
      const admin = new User({
        name: "Admin",
        email: "admin@pilotbattery.com",
        phone: "6374073238",
        password: "admin123",
        role: "admin",
      });
      await admin.save();
      console.log("Admin user created: admin@pilotbattery.com / admin123");
    } else {
      console.log("Admin user already exists: admin@pilotbattery.com");
    }

    // Create sample products
    const products = [
      // 🏍️ 2-WHEELER BATTERIES - Exide Xplore (48M Warranty)
      {
        name: "Exide Xplore 12X2.5L-C (2.5Ah)",
        price: 1096,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 2.5Ah - 48M Warranty",
        image: "/images/battery-two-wheeler.jpg",
        stock: 50,
      },
      {
        name: "Exide Xplore XLTZ4A (4Ah)",
        price: 1272,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 4Ah - 48M Warranty",
        stock: 45,
      },
      {
        name: "Exide Xplore XLTZ5A (5Ah)",
        price: 1503,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 5Ah - 48M Warranty",
        stock: 40,
      },
      {
        name: "Exide Xplore XLTZ6 (5Ah)",
        price: 1612,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 5Ah - 48M Warranty",
        stock: 40,
      },
      {
        name: "Exide Xplore 12X5L-B (5Ah)",
        price: 1657,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 5Ah - 48M Warranty",
        stock: 38,
      },
      {
        name: "Exide Xplore XLTZ7 (6Ah)",
        price: 1906,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 6Ah - 48M Warranty",
        stock: 35,
      },
      {
        name: "Exide Xplore 12X7-B (7Ah)",
        price: 1687,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 7Ah - 48M Warranty",
        stock: 35,
      },
      {
        name: "Exide Xplore XLTZ9 (9Ah)",
        price: 2313,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 9Ah - 48M Warranty",
        stock: 30,
      },
      {
        name: "Exide Xplore 12X9-B (9Ah)",
        price: 2379,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 9Ah - 48M Warranty",
        stock: 30,
      },
      {
        name: "Exide Xplore XLTZ14 (12Ah)",
        price: 3329,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 12Ah - 48M Warranty",
        stock: 25,
      },
      {
        name: "Exide Xplore 12X14L-A2 (14Ah)",
        price: 3832,
        category: "battery",
        subCategory: "two-wheeler",
        description: "Exide Xplore 14Ah - 48M Warranty",
        stock: 20,
      },
      // 🛺 3-WHEELER BATTERIES - Exide EKO (24M Warranty)
      {
        name: "Exide EKO EKO32 (32Ah)",
        price: 3603,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide EKO 32Ah - 24M Warranty",
        image: "/images/battery-three-wheeler.jpg",
        stock: 30,
      },
      {
        name: "Exide EKO EKO40L (35Ah)",
        price: 4253,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide EKO 35Ah - 24M Warranty",
        stock: 28,
      },
      {
        name: "Exide EKO EKO50L (50Ah)",
        price: 5829,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide EKO 50Ah - 24M Warranty",
        stock: 25,
      },
      {
        name: "Exide EKO EKO55L (55Ah)",
        price: 5940,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide EKO 55Ah - 24M Warranty",
        stock: 22,
      },
      {
        name: "Exide EKO EKO60L/R (60Ah)",
        price: 6078,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide EKO 60Ah - 24M Warranty",
        stock: 20,
      },
      // ⚡ E-RICKSHAW (3-Wheeler – EV) - Exide E-Ride Tubular Plus
      {
        name: "Exide E-Ride Tubular Plus ERTBPLUS125N (125Ah)",
        price: 10872,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide E-Ride Tubular Plus 125Ah - E-Rickshaw Battery",
        stock: 15,
      },
      {
        name: "Exide E-Ride Tubular Plus ERTBPLUS135N (135Ah)",
        price: 11317,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide E-Ride Tubular Plus 135Ah - E-Rickshaw Battery",
        stock: 12,
      },
      {
        name: "Exide E-Ride Tubular Plus ERTBPLUS150N (150Ah)",
        price: 12998,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide E-Ride Tubular Plus 150Ah - E-Rickshaw Battery",
        stock: 10,
      },
      {
        name: "Exide E-Ride Plus ERLPLUS100L (100Ah)",
        price: 9986,
        category: "battery",
        subCategory: "three-wheeler",
        description: "Exide E-Ride Plus 100Ah - E-Rickshaw Battery",
        stock: 15,
      },
      // 🚗 4-WHEELER (CAR / SUV) BATTERIES - Exide EPIC (77M Warranty)
      {
        name: "Exide EPIC EPIC35L (35Ah)",
        price: 5473,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide EPIC 35Ah - 77M Warranty",
        image: "/images/battery-four-wheeler.jpg",
        stock: 30,
      },
      {
        name: "Exide EPIC EPIC40LBH (40Ah)",
        price: 6150,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide EPIC 40Ah - 77M Warranty",
        stock: 28,
      },
      {
        name: "Exide EPIC EPICDIN74L (74Ah)",
        price: 13271,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide EPIC 74Ah - 77M Warranty",
        stock: 15,
      },
      // Exide MATRIX (72M Warranty)
      {
        name: "Exide MATRIX MT40B20L/R (40Ah)",
        price: 4889,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide MATRIX 40Ah - 72M Warranty",
        stock: 25,
      },
      {
        name: "Exide MATRIX MTRED45L (45Ah)",
        price: 8912,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide MATRIX 45Ah - 72M Warranty",
        stock: 20,
      },
      {
        name: "Exide MATRIX MTRED100 (100Ah)",
        price: 20215,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide MATRIX 100Ah - 72M Warranty",
        stock: 10,
      },
      // Exide MILEAGE (55M / 60M Warranty)
      {
        name: "Exide MILEAGE MILEAGE35 (35Ah)",
        price: 5657,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide MILEAGE 35Ah - 55M/60M Warranty",
        stock: 28,
      },
      {
        name: "Exide MILEAGE MILEAGE45 (45Ah)",
        price: 7799,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide MILEAGE 45Ah - 55M/60M Warranty",
        stock: 22,
      },
      {
        name: "Exide MILEAGE MLDIN70 (70Ah)",
        price: 10234,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide MILEAGE 70Ah - 55M/60M Warranty",
        stock: 18,
      },
      {
        name: "Exide MILEAGE MLDIN80 (80Ah)",
        price: 12768,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide MILEAGE 80Ah - 55M/60M Warranty",
        stock: 15,
      },
      // Exide EZZY (48M Warranty)
      {
        name: "Exide EZZY EYDIN47RMFFB (47Ah)",
        price: 7039,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide EZZY 47Ah - 48M Warranty",
        stock: 20,
      },
      {
        name: "Exide EZZY EYDIN52RMFFB (52Ah)",
        price: 7373,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide EZZY 52Ah - 48M Warranty",
        stock: 18,
      },
      {
        name: "Exide EZZY EYDIN78LMFFB (78Ah)",
        price: 9982,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide EZZY 78Ah - 48M Warranty",
        stock: 12,
      },
      // Exide RIDE (24M Warranty)
      {
        name: "Exide RIDE RIDE35L (35Ah)",
        price: 3507,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide RIDE 35Ah - 24M Warranty",
        stock: 30,
      },
      {
        name: "Exide RIDE RIDE45L (45Ah)",
        price: 5870,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide RIDE 45Ah - 24M Warranty",
        stock: 25,
      },
      {
        name: "Exide RIDE RIDE70L/R (65Ah)",
        price: 6009,
        category: "battery",
        subCategory: "four-wheeler",
        description: "Exide RIDE 65Ah - 24M Warranty",
        stock: 20,
      },
      // 🚚 CV / TRACTOR BATTERIES - Exide EXPRESS (42M Warranty)
      {
        name: "Exide EXPRESS XP800 (80Ah)",
        price: 8145,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide EXPRESS 80Ah - 42M Warranty",
        image: "/images/battery-truck.jpg",
        stock: 20,
      },
      {
        name: "Exide EXPRESS XP1000 (100Ah)",
        price: 10228,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide EXPRESS 100Ah - 42M Warranty",
        stock: 18,
      },
      {
        name: "Exide EXPRESS XP1200L (120Ah)",
        price: 12522,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide EXPRESS 120Ah - 42M Warranty",
        stock: 15,
      },
      {
        name: "Exide EXPRESS XP1500 (150Ah)",
        price: 16381,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide EXPRESS 150Ah - 42M Warranty",
        stock: 12,
      },
      {
        name: "Exide EXPRESS XP2000 (200Ah)",
        price: 25933,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide EXPRESS 200Ah - 42M Warranty",
        stock: 10,
      },
      // Tractor – Exide Jai Kisan
      {
        name: "Exide Jai Kisan KJ75TF (75Ah)",
        price: 7594,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide Jai Kisan 75Ah - Tractor Battery",
        stock: 18,
      },
      {
        name: "Exide Jai Kisan KJ80T (80Ah)",
        price: 7747,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide Jai Kisan 80Ah - Tractor Battery",
        stock: 16,
      },
      {
        name: "Exide Jai Kisan KJ88T/TLH (88Ah)",
        price: 7905,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide Jai Kisan 88Ah - Tractor Battery",
        stock: 15,
      },
      {
        name: "Exide Jai Kisan KJ90H29L (90Ah)",
        price: 7905,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide Jai Kisan 90Ah - Tractor Battery",
        stock: 14,
      },
      {
        name: "Exide Jai Kisan KJ99T (99Ah)",
        price: 9064,
        category: "battery",
        subCategory: "truck-series",
        description: "Exide Jai Kisan 99Ah - Tractor Battery",
        stock: 12,
      },
      // Home Batteries
      {
        name: "Exide Home Inverter Battery 12V 150Ah",
        price: 18000,
        category: "battery",
        subCategory: "home",
        description: "Long-lasting home inverter battery",
        image: "/images/battery-home.jpg",
        stock: 25,
      },
      {
        name: "Amaron Home Inverter Battery 12V 200Ah",
        price: 22000,
        category: "battery",
        subCategory: "home",
        description: "High capacity home inverter battery",
        stock: 20,
      },
      {
        name: "Luminous Home Battery 12V 150Ah",
        price: 16000,
        category: "battery",
        subCategory: "home",
        description: "Reliable home battery solution",
        stock: 18,
      },
      // UPS Systems
      {
        name: "APC UPS 600VA",
        price: 3500,
        category: "ups",
        subCategory: "ups-type1",
        description: "Standard UPS for home/office use",
        image: "/images/ups-type1.jpg",
        stock: 30,
      },
      {
        name: "APC UPS 1000VA",
        price: 5500,
        category: "ups",
        subCategory: "ups-type1",
        description: "Medium capacity UPS",
        stock: 25,
      },
      {
        name: "Microtek UPS 1000VA",
        price: 5000,
        category: "ups",
        subCategory: "ups-type2",
        description: "Advanced UPS with digital display",
        image: "/images/ups-type2.jpg",
        stock: 22,
      },
      {
        name: "Luminous UPS 1500VA",
        price: 7500,
        category: "ups",
        subCategory: "ups-type2",
        description: "High capacity UPS for heavy loads",
        stock: 18,
      },
      {
        name: "APC UPS 2000VA",
        price: 12000,
        category: "ups",
        subCategory: "ups-type3",
        description: "Premium UPS with extended backup",
        image: "/images/ups-type3.jpg",
        stock: 15,
      },
      {
        name: "Microtek UPS 2000VA",
        price: 11000,
        category: "ups",
        subCategory: "ups-type3",
        description: "Premium UPS with advanced features",
        stock: 12,
      },
    ];

    await Product.insertMany(products);
    console.log(`${products.length} products created`);

    console.log("Seed data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();

