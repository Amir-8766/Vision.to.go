const mongoose = require("mongoose");
const Partner = require("./models/Partner");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/thegrrrlsclub";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedPartners = async () => {
  try {
    await connectDB();

    // Clear existing partners
    await Partner.deleteMany({});
    console.log("Cleared existing partners");

    const partners = [
      {
        name: "Paracelsus Gesundheitsakademien",
        description:
          "Paracelsus ist die größte Heilpraktikerschule Deutschlands mit 54 Standorten in Deutschland und der Schweiz. Wir bieten umfassende Ausbildungen in Naturheilkunde, Psychotherapie, Osteopathie und Tierheilkunde an.",
        website: "https://www.paracelsus.de/heilpraktikerschulen",
        category: "education",
        services: [
          "Heilpraktiker/in Ausbildung",
          "Heilpraktiker/in für Psychotherapie",
          "Osteopath/in Ausbildung",
          "Tierheilpraktiker/in Ausbildung",
          "Ernährungsberater/-in Ausbildung",
          "Massagetherapie",
          "Fortbildungen für verschiedene Berufsgruppen",
        ],
        partnershipType: "geschaeftspartner",
        contactInfo: {
          phone: "0261 95 25 20",
          address: "54 Standorte in Deutschland und der Schweiz",
        },
        tags: [
          "Heilpraktiker",
          "Naturheilkunde",
          "Ausbildung",
          "Gesundheit",
          "Schweiz",
          "Deutschland",
        ],
        specialOffers: "Kostenlose Beratung und Infoveranstaltungen",
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Ulbrich Natur",
        description:
          "Ulbrich Natur ist spezialisiert auf Naturkosmetik und Naturtextilien. Wir bieten nachhaltige und natürliche Produkte für eine bewusste Lebensweise und umweltfreundliche Alternativen zu konventionellen Kosmetik- und Textilprodukten.",
        website: "https://www.instagram.com/ulbrichnatur_bielefeld",
        instagram: "https://www.instagram.com/ulbrichnatur_bielefeld",
        category: "natural_products",
        services: [
          "Naturkosmetik",
          "Naturtextilien",
          "Nachhaltige Produkte",
          "Umweltfreundliche Alternativen",
          "Bewusste Lebensweise",
        ],
        partnershipType: "synergin",
        contactInfo: {
          address: "Bielefeld, Deutschland",
        },
        tags: [
          "Naturkosmetik",
          "Naturtextilien",
          "Nachhaltigkeit",
          "Bio",
          "Umwelt",
          "Bielefeld",
        ],
        specialOffers: "Exklusive Rabatte auf nachhaltige Produkte",
        displayOrder: 2,
        isActive: true,
      },
      {
        name: "Fairticken",
        description:
          "Fairticken ist Ihr Online-Shop für nachhaltige Mode. Wir bieten VEGAN, ECO und FAIR Mode für Damen und Herren, inklusive FAIRTICKEN SHOES. Unser Fokus liegt auf ethischer Mode und nachhaltigen Alternativen.",
        website: "https://www.fairticken-shop.de",
        category: "fashion",
        services: [
          "VEGAN Mode",
          "ECO Mode",
          "FAIR Mode",
          "FAIRTICKEN SHOES",
          "Nachhaltige Sneaker",
          "Ethische Mode",
          "Damen- und Herrenmode",
        ],
        partnershipType: "geschaeftspartner",
        contactInfo: {
          address: "Deutschland",
        },
        tags: [
          "Vegan",
          "Eco",
          "Fair",
          "Nachhaltige Mode",
          "Sneaker",
          "Ethische Mode",
          "Online Shop",
        ],
        specialOffers: "Spezielle Editionen und SALE Events",
        displayOrder: 3,
        isActive: true,
      },
    ];

    for (const partnerData of partners) {
      const partner = new Partner(partnerData);
      await partner.save();
      console.log(`Created partner: ${partner.name}`);
    }

    console.log("Partners seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding partners:", error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  seedPartners();
}

module.exports = seedPartners;
