import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.scss";
import SEOHead from "../components/SEOHead";
import { apiFetch, BASE_URL, getImageUrl } from "../lib/api";
import OptimizedImage from "../components/OptimizedImage";
import LazyWrapper from "../components/LazyWrapper";
import ImageSlider from "../components/ImageSlider";

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
        description="Discover unique fashion items, accessories, and lifestyle products at The Grrrls Club. Shop now for the latest trends and exclusive collections."
        keywords="fashion, lifestyle, clothing, accessories, shopping, women, style, boutique"
      />

      <main id="main-content" className="min-h-screen bg-white">
        {/* Banner Section */}
        <section className={styles.bannerSection}>
          {/* Background image as content image to allow fetchpriority */}
          <picture>
            <img
              src={
                new URL("../assets/Background.Hero.jpg", import.meta.url).href
              }
              alt="Background"
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
        <section style={{ textAlign: "center", margin: "2.5rem 0 1.5rem 0" }}>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#849c22",
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

        {/* Featured Products Section - Dynamic */}
        <LazyWrapper className={styles.suggestedSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.suggestedSectionTitle}>Featured Products</h2>
            <OptimizedImage
              src="/line-woman02.jpg"
              alt="Fashion illustration"
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
            <h2 className={styles.featuresTitle}>
              Why Choose The Grrrls Club?
            </h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureImage}>
                  <OptimizedImage
                    src="/line-woman03.jpg"
                    alt="Sustainable fashion"
                    className={styles.featureIcon}
                    priority={false}
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className={styles.featureTitle}>Sustainable Fashion</h3>
                <p className={styles.featureDescription}>
                  Give clothes a second life and help save the environment
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureImage}>
                  <OptimizedImage
                    src="/line-woman04.jpg"
                    alt="Unique finds"
                    className={styles.featureIcon}
                    priority={false}
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className={styles.featureTitle}>Unique Finds</h3>
                <p className={styles.featureDescription}>
                  Discover one-of-a-kind pieces you won't find anywhere else
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureImage}>
                  <img
                    src="./line-woman06.png"
                    alt="Fast shipping"
                    className={styles.featureIcon}
                    width={80}
                    height={80}
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.src = "/line-woman06.png";
                    }}
                  />
                </div>
                <h3 className={styles.featureTitle}>Fast Shipping</h3>
                <p className={styles.featureDescription}>
                  Quick and reliable delivery to your doorstep
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
                src="/line-woman11.png"
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
                  <div key={affiliate._id} className={styles.partnerCard}>
                    <div className={styles.partnerImage}>
                      <OptimizedImage
                        src={affiliate.featuredImage || "/line-woman12.png"}
                        alt={affiliate.name}
                        className={styles.partnerImageContent}
                        priority={false}
                      />
                    </div>
                    <div className={styles.partnerInfo}>
                      <h3 className={styles.partnerName}>{affiliate.name}</h3>
                      <p className={styles.partnerDescription}>
                        {affiliate.description?.substring(0, 100)}...
                      </p>
                      <div className={styles.partnerCategory}>
                        {affiliate.category === "education" && "🎓 Ausbildung"}
                        {affiliate.category === "natural_products" &&
                          "🌿 Naturprodukte"}
                        {affiliate.category === "fashion" && "👗 Mode"}
                        {affiliate.category === "health_wellness" &&
                          "💊 Gesundheit"}
                        {affiliate.category === "beauty" && "💄 Schönheit"}
                        {affiliate.category === "sustainability" &&
                          "♻️ Nachhaltigkeit"}
                        {affiliate.category === "other" && "🔗 Andere"}
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
              <h2 className={styles.ctaTitle}>Ready to Start Shopping?</h2>
              <p className={styles.ctaDescription}>
                Join thousands of fashion lovers who have discovered their style
                at The Grrrls Club
              </p>
              <Link to="/products">
                <button className={styles.ctaButton}>
                  Explore Our Collection
                </button>
              </Link>
            </div>
            <div className={styles.ctaImage}>
              <img
                src="./line-woman09.png"
                alt="Shopping illustration"
                className={styles.ctaIllustration}
                width={400}
                height={300}
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
