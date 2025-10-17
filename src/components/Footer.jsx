import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  CreditCard,
  Banknote,
} from "lucide-react";

export function Footer() {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <footer
      ref={footerRef}
      className={`footer-container ${
        isVisible ? "footer-visible" : "footer-hidden"
      }`}
      style={{ borderRadius: "20px 20px 0 0" }}
    >
      <div className="footer-grid">
        {/* Logo Section - Left Corner */}
        <div>
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="footer-title">VisionToGo</h2>
              <p className="footer-subtitle">Ihr Reisepartner</p>
            </div>
          </div>
          <p className="footer-description">
            Entdecken Sie die Welt mit uns. Die besten Reiseangebote und Tools
            für unvergessliche Abenteuer.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="footer-section-title">Schnelllinks</h3>
          <ul className="footer-links">
            <li>
              <a href="/deals">Angebote</a>
            </li>
            <li>
              <a href="/shop">Shop</a>
            </li>
            <li>
              <a href="/tools">Reise-Tools</a>
            </li>
            <li>
              <a href="/affiliates">Partner</a>
            </li>
            <li>
              <a href="/about">Über uns</a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="footer-section-title">Support</h3>
          <ul className="footer-links">
            <li>
              <a href="/contact">Kontakt</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Hilfe Center</a>
            </li>
            <li>
              <a href="/impressum">Impressum</a>
            </li>
            <li>
              <a href="/datenschutz">Datenschutz</a>
            </li>
            <li>
              <a href="#">AGB</a>
            </li>
          </ul>

          {/* Contact Info */}
          <div className="footer-contact-info">
            <div className="footer-contact-item">
              <Mail className="w-4 h-4" />
              <span>info@visiontogo.de</span>
            </div>
            <div className="footer-contact-item">
              <Phone className="w-4 h-4" />
              <span>+49 (0) 123 456 789</span>
            </div>
          </div>
        </div>

        {/* Social & Payment */}
        <div>
          <h3 className="footer-section-title">Folgen Sie uns</h3>

          {/* Social Media */}
          <div className="footer-social-links">
            <a
              href="#"
              title="Facebook"
              className="footer-social-link facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              title="Instagram"
              className="footer-social-link instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" title="Twitter" className="footer-social-link twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              title="LinkedIn"
              className="footer-social-link linkedin"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="footer-payment-title">Sichere Zahlung</h4>
            <div className="footer-payment-methods">
              <div className="footer-payment-card footer-payment-visa">
                VISA
              </div>
              <div className="footer-payment-card footer-payment-mastercard">
                MC
              </div>
              <div className="footer-payment-card footer-payment-paypal">
                PP
              </div>
              <div className="footer-payment-card footer-payment-sepa">
                <Banknote className="w-4 h-4" />
              </div>
              <div className="footer-payment-card footer-payment-generic">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} VisionToGo. Alle Rechte vorbehalten.
        </p>
        <div className="footer-legal-links">
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
