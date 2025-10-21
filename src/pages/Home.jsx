import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.scss";
import SEOHead from "../components/SEOHead";
import { apiFetch, BASE_URL, getImageUrl } from "../lib/api";
import OptimizedImage from "../components/OptimizedImage";
import LazyWrapper from "../components/LazyWrapper";
import ImageSlider from "../components/ImageSlider";
import { PiInstagramLogoLight } from "react-icons/pi";
import beautifulCollage from "../assets/beautiful-collage-travel-concept-removebg-preview.png";
import flightLineArt from "../assets/Flight line art.png";
import affiliateMarketing from "../assets/affiliate-marketing-fotor-20251020213745.png";
import travelEssential from "../assets/travel essemtial.png";
import synergyIcon from "../assets/synergy-icon-line-illustration-vector.jpg";
import featureProduct from "../assets/feature product.jpg";
import travelPlan from "../assets/Travel Plan.webp";
import homeLogo from "../assets/Home-Logo.png";
import FlightCard from "../components/ui/FlightCard.jsx";

export default function Home() {
  const [newestProducts, setNewestProducts] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const featuredRes = await apiFetch("/featured-products");
        if (featuredRes.ok) {
          const featuredProducts = await featuredRes.json();
          const products = featuredProducts
            .map((fp) => fp.productId)
            .filter(Boolean);
          setNewestProducts(products);
        } else {
          // Fallback to newest products
          const res = await apiFetch("/products");
          if (res.ok) {
            const products = await res.json();
            const newest = products.slice(0, 4);
            setNewestProducts(newest);
          }
        }

        // Fetch affiliates
        const affiliatesRes = await apiFetch("/partners");
        if (affiliatesRes.ok) {
          const affiliatesData = await affiliatesRes.json();
          setAffiliates(affiliatesData.slice(0, 3)); // Show only first 3 affiliates
        } else {
          // Fallback affiliates data
          const fallbackAffiliates = [
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
          setAffiliates(fallbackAffiliates);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to newest products
        try {
          const res = await apiFetch("/products");
          if (res.ok) {
            const products = await res.json();
            const newest = products.slice(0, 4);
            setNewestProducts(newest);
          }
        } catch (fallbackError) {
          console.error("Error fetching fallback products:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <SEOHead
        title="Vision To Go - Travel & Flight Deals"
        description="Find the best flight deals, travel essentials, and exclusive offers at Vision To Go. Book your next adventure with unbeatable prices and quality service."
        keywords="flights, travel, deals, airline tickets, travel essentials, affiliate program, cheap flights, vacation packages"
      />

      <main id="main-content" className="min-h-screen bg-white">
        {/* Banner Section */}
        <section className={styles.bannerSection}>
          {/* Background image as content image to allow fetchpriority */}
          <picture>
            <img
              src={homeLogo}
              alt="Vision To Go Background"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div
            className={styles.bannerBox}
            style={{ position: "relative", zIndex: 1 }}
          >
            <h2>Your Gateway to Flights, Tours & Travel Essentials</h2>
            <p>
              Book your next trip with the best deals on flights and vacations
            </p>
            <span style={{ color: "#849c22", fontWeight: 700 }}>
              #FlyExploreRelax
            </span>
          </div>
        </section>

        {/* Image Slider Section */}
        <ImageSlider />

        {/* Welcome Message Section */}
        <section style={{ textAlign: "center", margin: "10rem 0 1.5rem 0" }}>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#faba00",
            }}
          >
            Plan Your Next Journey with VisionToGo
          </h1>
          <div style={{ fontSize: "1.1rem", color: "#444", fontWeight: 500 }}>
            Flights, tours and travel gear — all in one place{" "}
            <span style={{ color: "#849c22", fontWeight: 700 }}>
              #FlyExploreRelax
            </span>
          </div>
        </section>

        {/* Last Minute Flights Section */}
        <LazyWrapper className={`${styles.suggestedSection} mt-44`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.suggestedSectionTitle}>
              Last Minute Flights
            </h2>
            <OptimizedImage
              src={flightLineArt}
              alt="Last minute flights illustration"
              className={styles.sectionIcon}
              priority={true}
              width={60}
              height={60}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
            {[
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=400&auto=format&fit=crop",
                airline: "Lufthansa",
                flightCode: "LH 441",
                flightClass: "Economy",
                departureCode: "FRA",
                departureCity: "Frankfurt",
                departureTime: "08:45",
                arrivalCode: "BCN",
                arrivalCity: "Barcelona",
                arrivalTime: "11:20",
                duration: "2h 35m",
                price: "€89",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop",
                airline: "Eurowings",
                flightCode: "EW 1234",
                flightClass: "Economy",
                departureCode: "MUC",
                departureCity: "Munich",
                departureTime: "14:30",
                arrivalCode: "MAD",
                arrivalCity: "Madrid",
                arrivalTime: "17:15",
                duration: "2h 45m",
                price: "€95",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop",
                airline: "Alitalia",
                flightCode: "AZ 567",
                flightClass: "Economy",
                departureCode: "FCO",
                departureCity: "Rome",
                departureTime: "09:15",
                arrivalCode: "CDG",
                arrivalCity: "Paris",
                arrivalTime: "11:45",
                duration: "2h 30m",
                price: "€78",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1506905925346-14b1e5dba7c4?q=80&w=400&auto=format&fit=crop",
                airline: "KLM",
                flightCode: "KL 890",
                flightClass: "Economy",
                departureCode: "HAM",
                departureCity: "Hamburg",
                departureTime: "16:20",
                arrivalCode: "AMS",
                arrivalCity: "Amsterdam",
                arrivalTime: "17:40",
                duration: "1h 20m",
                price: "€65",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400&auto=format&fit=crop",
                airline: "Czech Airlines",
                flightCode: "OK 234",
                flightClass: "Economy",
                departureCode: "TXL",
                departureCity: "Berlin",
                departureTime: "12:45",
                arrivalCode: "PRG",
                arrivalCity: "Prague",
                arrivalTime: "13:55",
                duration: "1h 10m",
                price: "€45",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop",
                airline: "Austrian",
                flightCode: "OS 345",
                flightClass: "Economy",
                departureCode: "MUC",
                departureCity: "Munich",
                departureTime: "10:30",
                arrivalCode: "VIE",
                arrivalCity: "Vienna",
                arrivalTime: "11:45",
                duration: "1h 15m",
                price: "€72",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop",
                airline: "Swiss",
                flightCode: "LX 456",
                flightClass: "Economy",
                departureCode: "FRA",
                departureCity: "Frankfurt",
                departureTime: "15:10",
                arrivalCode: "ZUR",
                arrivalCity: "Zurich",
                arrivalTime: "16:25",
                duration: "1h 15m",
                price: "€85",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1506905925346-14b1e5dba7c4?q=80&w=400&auto=format&fit=crop",
                airline: "SAS",
                flightCode: "SK 567",
                flightClass: "Economy",
                departureCode: "HAM",
                departureCity: "Hamburg",
                departureTime: "13:25",
                arrivalCode: "CPH",
                arrivalCity: "Copenhagen",
                arrivalTime: "14:40",
                duration: "1h 15m",
                price: "€58",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=400&auto=format&fit=crop",
                airline: "SAS",
                flightCode: "SK 678",
                flightClass: "Economy",
                departureCode: "TXL",
                departureCity: "Berlin",
                departureTime: "11:40",
                arrivalCode: "ARN",
                arrivalCity: "Stockholm",
                arrivalTime: "13:20",
                duration: "1h 40m",
                price: "€68",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop",
                airline: "Norwegian",
                flightCode: "DY 789",
                flightClass: "Economy",
                departureCode: "MUC",
                departureCity: "Munich",
                departureTime: "08:50",
                arrivalCode: "OSL",
                arrivalCity: "Oslo",
                arrivalTime: "10:55",
                duration: "2h 05m",
                price: "€75",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop",
                airline: "Finnair",
                flightCode: "AY 890",
                flightClass: "Economy",
                departureCode: "FRA",
                departureCity: "Frankfurt",
                departureTime: "14:15",
                arrivalCode: "HEL",
                arrivalCity: "Helsinki",
                arrivalTime: "16:35",
                duration: "2h 20m",
                price: "€82",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1506905925346-14b1e5dba7c4?q=80&w=400&auto=format&fit=crop",
                airline: "Brussels Airlines",
                flightCode: "SN 901",
                flightClass: "Economy",
                departureCode: "HAM",
                departureCity: "Hamburg",
                departureTime: "17:30",
                arrivalCode: "BRU",
                arrivalCity: "Brussels",
                arrivalTime: "19:05",
                duration: "1h 35m",
                price: "€52",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400&auto=format&fit=crop",
                airline: "Air France",
                flightCode: "AF 012",
                flightClass: "Economy",
                departureCode: "FRA",
                departureCity: "Frankfurt",
                departureTime: "12:00",
                arrivalCode: "ORY",
                arrivalCity: "Paris",
                arrivalTime: "13:30",
                duration: "1h 30m",
                price: "€88",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=400&auto=format&fit=crop",
                airline: "Iberia",
                flightCode: "IB 123",
                flightClass: "Economy",
                departureCode: "MUC",
                departureCity: "Munich",
                departureTime: "16:45",
                arrivalCode: "BCN",
                arrivalCity: "Barcelona",
                arrivalTime: "19:20",
                duration: "2h 35m",
                price: "€92",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop",
                airline: "TAP Air Portugal",
                flightCode: "TP 234",
                flightClass: "Economy",
                departureCode: "TXL",
                departureCity: "Berlin",
                departureTime: "09:30",
                arrivalCode: "LIS",
                arrivalCity: "Lisbon",
                arrivalTime: "12:15",
                duration: "2h 45m",
                price: "€76",
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop",
                airline: "Turkish Airlines",
                flightCode: "TK 345",
                flightClass: "Economy",
                departureCode: "FRA",
                departureCity: "Frankfurt",
                departureTime: "18:20",
                arrivalCode: "IST",
                arrivalCity: "Istanbul",
                arrivalTime: "22:45",
                duration: "4h 25m",
                price: "€125",
              },
            ].map((flight, index) => (
              <FlightCard key={index} {...flight} />
            ))}
          </div>
        </LazyWrapper>

        {/* Featured Products Section - Dynamic */}
        <LazyWrapper className={`${styles.suggestedSection} mt-40`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.suggestedSectionTitle}>Featured Products</h2>
            <OptimizedImage
              src={featureProduct}
              alt="Featured Products illustration"
              className={styles.sectionIcon}
              priority={true}
              width={60}
              height={60}
            />
          </div>
          {loading ? (
            <div className={styles.suggestedGrid}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={styles.suggestedItem}>
                  <div className="animate-pulse bg-gray-200 h-48 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-4 rounded mt-2"></div>
                  <div className="animate-pulse bg-gray-200 h-4 rounded mt-1 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.suggestedGrid}>
              {newestProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className={styles.suggestedItem}
                >
                  <div className={styles.suggestedImageWrapper}>
                    <OptimizedImage
                      src={getImageUrl(product.images?.[0] || product.image)}
                      alt={product.name}
                      className={styles.suggestedImage}
                      priority={false}
                    />
                  </div>
                  <div className={styles.suggestedInfo}>
                    <h3 className={styles.suggestedTitle}>{product.name}</h3>
                    <p className={styles.suggestedPrice}>
                      €{product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </LazyWrapper>

        {/* Features Section with Line Women */}
        <LazyWrapper className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <h2 className={styles.featuresTitle}>Why Choose Vision To Go?</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureImage}>
                  <OptimizedImage
                    src={flightLineArt}
                    alt="Best Flight Deals"
                    className={styles.featureIcon}
                    priority={false}
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className={styles.featureTitle}>Best Flight Deals</h3>
                <p className={styles.featureDescription}>
                  Find the cheapest flights and exclusive travel offers
                  worldwide
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureImage}>
                  <OptimizedImage
                    src={affiliateMarketing}
                    alt="Affiliate Program"
                    className={styles.featureIcon}
                    priority={false}
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className={styles.featureTitle}>Affiliate Program</h3>
                <p className={styles.featureDescription}>
                  Earn commissions by promoting our travel deals and flight
                  offers
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureImage}>
                  <OptimizedImage
                    src={travelEssential}
                    alt="Travel Essentials"
                    className={styles.featureIcon}
                    priority={false}
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className={styles.featureTitle}>Travel Essentials</h3>
                <p className={styles.featureDescription}>
                  Complete your journey with quality travel accessories and gear
                </p>
              </div>
            </div>
          </div>
        </LazyWrapper>

        {/* Partners Section */}
        <LazyWrapper className={styles.partnersSection}>
          <div className={styles.partnersContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.partnersTitle}>
                Unsere Geschäftspartner & Synergin
              </h2>
              <OptimizedImage
                src={synergyIcon}
                alt="Partners illustration"
                className={styles.sectionIcon}
                priority={false}
                width={60}
                height={60}
              />
            </div>
            <p className={styles.partnersDescription}>
              Entdecken Sie unsere wertvollen Partner, die nachhaltige und
              natürliche Lösungen anbieten
            </p>
            <div className={styles.partnersGrid}>
              {loading ? (
                <div className={styles.partnersLoading}>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className={styles.partnerCard}>
                      <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
                      <div className="animate-pulse bg-gray-200 h-4 rounded mt-2"></div>
                      <div className="animate-pulse bg-gray-200 h-4 rounded mt-1 w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                affiliates.map((affiliate) => (
                  <div
                    key={affiliate._id}
                    className={`${styles.partnerCard} flex flex-col h-full`}
                  >
                    <div className={styles.partnerImage}>
                      <OptimizedImage
                        src={getImageUrl(
                          affiliate.featuredImage ||
                            affiliate.logo ||
                            "/line-woman12.png"
                        )}
                        alt={affiliate.name}
                        className={styles.partnerImageContent}
                        priority={false}
                      />
                    </div>
                    <div
                      className={`${styles.partnerInfo} flex flex-col flex-1`}
                    >
                      <div className="flex-1">
                        <h3 className={styles.partnerName}>{affiliate.name}</h3>
                        <p className={styles.partnerDescription}>
                          {affiliate.description?.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className={`${styles.partnerCategory}`}>
                          {affiliate.category === "flights" && "✈️ Flights"}
                          {affiliate.category === "hotels" && "🏨 Hotels"}
                          {affiliate.category === "transport" && "🚄 Transport"}
                          {affiliate.category === "packages" && "🎁 Packages"}
                          {affiliate.category === "car_rental" &&
                            "🚗 Car Rental"}
                          {affiliate.category === "travel_insurance" &&
                            "🛡️ Travel Insurance"}
                          {affiliate.category === "activities" &&
                            "🎯 Activities & Tours"}
                          {affiliate.category === "other" && "🔗 Other"}
                        </div>
                        {affiliate.instagram && (
                          <a
                            href={affiliate.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800 text-2xl"
                            title="Follow on Instagram"
                          >
                            <PiInstagramLogoLight />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className={styles.partnersCTA}>
              <Link to="/affiliates">
                <button className={styles.partnersButton}>
                  Alle Affiliates entdecken
                </button>
              </Link>
            </div>
          </div>
        </LazyWrapper>

        {/* CTA Section with Line Woman */}
        <LazyWrapper className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaText}>
              <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
              <p className={styles.ctaDescription}>
                Join thousands of travelers who have found their perfect flights
                and travel essentials with Vision To Go
              </p>
              <Link to="/products">
                <button className={styles.ctaButton}>
                  Explore Travel Deals
                </button>
              </Link>
            </div>
            <div className={styles.ctaImage}>
              <img
                src={beautifulCollage}
                alt="Travel illustration"
                className={styles.ctaIllustration}
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                  e.target.src = "/line-woman09.png";
                }}
              />
            </div>
          </div>
        </LazyWrapper>
      </main>
    </>
  );
}
