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

// Get travel affiliate offers
router.get("/offers", async (req, res) => {
  try {
    const { category, sortBy, limit = 20 } = req.query;

    // Sample travel affiliate offers (in production, these would come from APIs)
    const offers = [
      {
        id: "skyscanner-1",
        partner: "Skyscanner",
        title: "Berlin to Istanbul",
        description: "Find the best flight deals from Berlin to Istanbul",
        category: "flights",
        originalPrice: 450,
        discountedPrice: 320,
        discount: 28,
        commission: 15,
        deepLink:
          "https://www.skyscanner.net/transport/flights/ber/ist/?utm_source=visiontogo&utm_medium=affiliate&utm_campaign=skyscanner",
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "booking-1",
        partner: "Booking.com",
        title: "Hotels in Paris",
        description: "Book your perfect stay in Paris with exclusive discounts",
        category: "hotels",
        originalPrice: 120,
        discountedPrice: 85,
        discount: 29,
        commission: 8,
        deepLink:
          "https://www.booking.com/searchresults.html?ss=Paris&utm_source=visiontogo&utm_medium=affiliate&utm_campaign=booking",
        image:
          "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "omio-1",
        partner: "Omio",
        title: "Train Travel Europe",
        description: "Explore Europe by train with flexible booking options",
        category: "transport",
        originalPrice: 89,
        discountedPrice: 65,
        discount: 27,
        commission: 12,
        deepLink:
          "https://www.omio.com/search?from=Berlin&to=Munich&utm_source=visiontogo&utm_medium=affiliate&utm_campaign=omio",
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "kiwi-1",
        partner: "Kiwi.com",
        title: "Multi-city Flight Deals",
        description:
          "Visit multiple destinations with our smart flight combinations",
        category: "flights",
        originalPrice: 680,
        discountedPrice: 520,
        discount: 23,
        commission: 18,
        deepLink:
          "https://www.kiwi.com/de/search/results/berlin-germany/munich-germany/2024-02-15/2024-02-20?utm_source=visiontogo&utm_medium=affiliate&utm_campaign=kiwi",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "agoda-1",
        partner: "Agoda",
        title: "Asia Hotel Deals",
        description: "Discover amazing hotels across Asia with special rates",
        category: "hotels",
        originalPrice: 95,
        discountedPrice: 72,
        discount: 24,
        commission: 10,
        deepLink:
          "https://www.agoda.com/search?city=15652&utm_source=visiontogo&utm_medium=affiliate&utm_campaign=agoda",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "expedia-flights",
        partner: "Expedia",
        title: "Flight Deals",
        description: "Find the best flight deals worldwide with Expedia",
        category: "flights",
        originalPrice: 500,
        discountedPrice: 380,
        discount: 24,
        commission: 15,
        deepLink: "https://expedia.com/affiliate/df9LkQA",
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "expedia-hotels",
        partner: "Expedia",
        title: "Hotels Worldwide",
        description: "Book hotels worldwide with exclusive Expedia deals",
        category: "hotels",
        originalPrice: 200,
        discountedPrice: 150,
        discount: 25,
        commission: 12,
        deepLink: "https://expedia.com/affiliate/wZ6ppZg",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "expedia-cars",
        partner: "Expedia",
        title: "Car Rentals",
        description: "Rent cars worldwide with great Expedia deals",
        category: "transport",
        originalPrice: 80,
        discountedPrice: 60,
        discount: 25,
        commission: 10,
        deepLink: "https://expedia.com/affiliate/XHpx6XZ",
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "expedia-packages",
        partner: "Expedia",
        title: "Vacation Packages",
        description: "Complete vacation packages with flights, hotels & more",
        category: "packages",
        originalPrice: 1200,
        discountedPrice: 900,
        discount: 25,
        commission: 18,
        deepLink: "https://expedia.com/affiliate/BQMQJuf",
        image:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        featured: true,
      },
    ];

    // Filter by category
    let filteredOffers = offers;
    if (category && category !== "all") {
      filteredOffers = offers.filter((offer) => offer.category === category);
    }

    // Sort offers
    if (sortBy === "discount") {
      filteredOffers.sort((a, b) => b.discount - a.discount);
    } else if (sortBy === "price") {
      filteredOffers.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === "commission") {
      filteredOffers.sort((a, b) => b.commission - a.commission);
    } else {
      // Default: featured first, then by discount
      filteredOffers.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.discount - a.discount;
      });
    }

    // Limit results
    const limitedOffers = filteredOffers.slice(0, parseInt(limit));

    res.json({
      offers: limitedOffers,
      total: filteredOffers.length,
      categories: ["all", "flights", "hotels", "transport", "packages"],
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ error: err.message });
  }
});

// Track affiliate clicks
router.post("/click", async (req, res) => {
  try {
    const { offerId, userId, sessionId, campaignId } = req.body;

    // In production, you would save this to a ClickTracking collection
    const clickData = {
      offerId,
      userId: userId || null,
      sessionId: sessionId || req.sessionID || null,
      campaignId: campaignId || "default",
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      referer: req.get("Referer"),
    };

    console.log("Affiliate click tracked:", clickData);

    // For now, just log the click
    // In production: await ClickTracking.create(clickData);

    res.json({
      success: true,
      message: "Click tracked successfully",
      clickId: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  } catch (err) {
    console.error("Error tracking click:", err);
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
