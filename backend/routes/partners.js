const express = require("express");
const router = express.Router();
const Partner = require("../models/Partner");
const { authMiddleware } = require("../middleware/auth");

// Get all active partners for public view
router.get("/", async (req, res) => {
  try {
    const { category, partnershipType, search } = req.query;

    let query = { isActive: true };

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by partnership type
    if (partnershipType && partnershipType !== "all") {
      query.partnershipType = partnershipType;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { services: { $in: [new RegExp(search, "i")] } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const partners = await Partner.find(query).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    console.log("Found partners:", partners.length);

    // If no partners found in database, return sample data
    if (partners.length === 0) {
      const samplePartners = [
        {
          _id: "sample1",
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
          _id: "sample2",
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
          _id: "sample3",
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

      // Apply filters to sample data
      let filteredPartners = samplePartners;

      if (category && category !== "all") {
        filteredPartners = filteredPartners.filter(
          (p) => p.category === category
        );
      }

      if (partnershipType && partnershipType !== "all") {
        filteredPartners = filteredPartners.filter(
          (p) => p.partnershipType === partnershipType
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredPartners = filteredPartners.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.services.some((s) => s.toLowerCase().includes(searchLower)) ||
            p.tags.some((t) => t.toLowerCase().includes(searchLower))
        );
      }

      return res.json(filteredPartners);
    }

    res.json(partners);
  } catch (err) {
    console.error("Error fetching partners:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all partners for admin (including inactive)
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { category, partnershipType, search } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by partnership type
    if (partnershipType && partnershipType !== "all") {
      query.partnershipType = partnershipType;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { services: { $in: [new RegExp(search, "i")] } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const partners = await Partner.find(query).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single partner by ID
router.get("/:id", async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    // If partner is inactive and user is not admin, return 404
    if (!partner.isActive && (!req.user || req.user.role !== "admin")) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new partner (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const partner = new Partner(req.body);
    await partner.save();

    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update partner (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(partner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete partner (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const partner = await Partner.findByIdAndDelete(req.params.id);

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json({ message: "Partner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get partner categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = [
      { value: "education", label: "Education & Training", icon: "🎓" },
      { value: "natural_products", label: "Natural Products", icon: "🌿" },
      { value: "fashion", label: "Fashion & Clothing", icon: "👗" },
      { value: "health_wellness", label: "Health & Wellness", icon: "💊" },
      { value: "beauty", label: "Beauty", icon: "💄" },
      { value: "sustainability", label: "Sustainability", icon: "♻️" },
      { value: "other", label: "Other", icon: "🔗" },
    ];

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get partnership types
router.get("/types/list", async (req, res) => {
  try {
    const types = [
      { value: "geschaeftspartner", label: "Geschäftspartner", icon: "🤝" },
      { value: "synergin", label: "Synergin", icon: "⚡" },
    ];

    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test endpoint to check database connection and data
router.get("/debug/test", async (req, res) => {
  try {
    const totalPartners = await Partner.countDocuments();
    const activePartners = await Partner.countDocuments({ isActive: true });
    const allPartners = await Partner.find({}).limit(5);

    res.json({
      totalPartners,
      activePartners,
      samplePartners: allPartners,
      message: "Database connection working",
    });
  } catch (err) {
    console.error("Test endpoint error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
