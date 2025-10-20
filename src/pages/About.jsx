import lineWoman11 from "../assets/line-woman11.png";
import lineWoman12 from "../assets/line-woman12.png";
import lineWoman13 from "../assets/line-woman13.png";
import aboutUsImg from "../assets/aboutUs.jpg";
import about01 from "../assets/about01.jpg";
import about02 from "../assets/about02.jpg";
import about03 from "../assets/about03.jpg";
import about04 from "../assets/about04.jpg";
import about05 from "../assets/about05.jpg";
import about06 from "../assets/about06.jpg";
import footerAboutUs from "../assets/footerAboutUs.jpg";

export default function About() {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative w-full h-[460px] mb-8 flex items-center rounded-xl overflow-hidden">
        <img
          src={aboutUsImg}
          alt="About Us"
          className="w-full h-full object-cover object-[75%_center] md:object-center"
          fetchpriority="high"
          decoding="async"
        />
        <div
          className="absolute left-0 top-0 h-full flex flex-col justify-center pl-3 md:pl-8 bg-gradient-to-r from-white/80 to-transparent"
          style={{ width: "45%", maxWidth: "600px" }}
        >
          <h1 className="text-xl md:text-4xl font-bold mb-2 md:mb-4 leading-snug">
            Vision To Go — Your Gateway to Smart Travel
          </h1>
          <h3 className="text-sm md:text-xl font-medium">
            We help you find cheap flights, trusted partners, and must‑have
            travel gear — all in one place.
          </h3>
        </div>
      </div>

      {/* Selling is simple section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className="flex items-end mb-8">
          <h2 className="text-2xl font-bold flex-1 text-left">
            Booking is simple
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={about01}
              alt="Search flights"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">1. Search flights</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Enter your route and dates. We scan trusted providers to surface
              the best prices in real time.
            </p>
            <a
              href="/how-to-list"
              className="text-[#849c22] font-medium border-b-2 border-[#849c22] hover:text-[#849c22] transition"
            >
              Learn more
            </a>
          </div>
          {/* Card 2 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={about02}
              alt="Compare and book"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">2. Compare & Book</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Filter by stops, times, and airlines. Book securely with our
              partners at the lowest available fare.
            </p>
            <a
              href="/how-to-ship"
              className="text-[#849c22] font-medium border-b-2 border-[#849c22] hover:text-[#849c22] transition"
            >
              Learn more
            </a>
          </div>
          {/* Card 3 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={about03}
              alt="Get ready to fly"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">3. Get ready to fly</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Receive your e‑ticket, travel tips, and a checklist of essentials
              to make your journey smooth.
            </p>
            <a
              href="/how-to-get-paid"
              className="text-[#849c22] font-medium border-b-2 border-[#849c22] hover:text-[#849c22] transition"
            >
              Learn more
            </a>
          </div>
        </div>
        {/* Start selling button */}
        <div className="flex justify-center mt-10">
          <a
            href="/services"
            className="px-8 py-3 rounded border border-teal-700 text-teal-700 font-semibold hover:bg-[#849c22] hover:text-white transition text-lg shadow-sm"
          >
            Explore flight deals
          </a>
        </div>
      </div>
      {/* خط نازک خاکستری */}
      <hr className="my-16 border-gray-200" />

      {/* Shop safely and securely section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className="flex items-end mb-8">
          <h2 className="text-2xl font-bold flex-1 text-left">
            Travel safely and confidently
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={about04}
              alt="Find deals"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">1. Find deals</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Discover exclusive flight offers and seasonal discounts from
              trusted partners.
            </p>
            <a
              href="/how-to-find"
              className="text-[#849c22] font-medium border-b-2 border-[#849c22] hover:text-[#849c22] transition"
            >
              Learn more
            </a>
          </div>
          {/* Card 2 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={about05}
              alt="Book with confidence"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">2. Book with confidence</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Secure checkout, transparent pricing, and clear policies you can
              rely on.
            </p>
            <a
              href="/how-to-buy"
              className="text-[#849c22] font-medium border-b-2 border-[#849c22] hover:text-[#849c22] transition"
            >
              Learn more
            </a>
          </div>
          {/* Card 3 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={about06}
              alt="Enjoy your trip"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">3. Enjoy your trip</h3>
            <p className="mb-4 text-gray-700 text-sm">
              From packing tips to destination ideas — we make flying easier and
              more enjoyable.
            </p>
            <a
              href="/how-to-get"
              className="text-[#849c22] font-medium border-b-2 border-[#849c22] hover:text-[#849c22] transition"
            >
              Learn more
            </a>
          </div>
        </div>
        {/* Start shopping button */}
        <div className="flex justify-center mt-10">
          <a
            href="/products"
            className="px-8 py-3 rounded border border-teal-700 text-[#849c22] font-semibold hover:bg-teal-700 hover:text-white transition text-lg shadow-sm"
          >
            Shop travel essentials
          </a>
        </div>
      </div>

      {/* خط نازک خاکستری */}
      <hr className="my-16 border-gray-200" />

      {/* You’re safe with us section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-left">Why trust us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Card 1 */}
          <div className="flex items-start gap-4">
            {/* Lock Icon */}
            <div className="flex-shrink-0 mt-1">
              {/* SVG lock icon */}
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="12" fill="#E6F4F1" />
                <path
                  d="M7 10V8a5 5 0 0110 0v2"
                  stroke="#00897b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect
                  x="6"
                  y="10"
                  width="12"
                  height="8"
                  rx="2"
                  stroke="#00897b"
                  strokeWidth="2"
                />
                <circle cx="12" cy="14" r="1" fill="#00897b" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Secure by design</h3>
              <p className="mb-2 text-gray-700 text-sm">
                We partner with reputable providers and payment gateways, so
                your data and bookings stay protected.
              </p>
              <a
                href="/buyer-protection"
                className="text-[#849c22] font-medium border-b-2 border-[#849c22] hover:text-[#849c22] transition"
              >
                Learn more
              </a>
            </div>
          </div>
          {/* Card 2 */}
          <div className="flex items-start gap-4">
            {/* Money Icon */}
            <div className="flex-shrink-0 mt-1">
              {/* SVG money icon */}
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="12" fill="#E6F4F1" />
                <rect
                  x="6"
                  y="10"
                  width="12"
                  height="6"
                  rx="2"
                  stroke="#00897b"
                  strokeWidth="2"
                />
                <circle cx="12" cy="13" r="1" fill="#00897b" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Clear refund policy</h3>
              <p className="mb-2 text-gray-700 text-sm">
                Get support for issues with your booking. We provide clear
                guidance and advocate with partners when plans change.
              </p>
              <a
                href="/refund-policy"
                className="text-[#849c22] font-medium border-b-2 border-[#849c22] hover:text-[#849c22] transition"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner Section */}
      <div className="relative w-full mt-16">
        <img
          src={footerAboutUs}
          alt="Footer Banner"
          className="w-full h-[320px] object-cover object-left md:object-center"
          style={{ minHeight: 220 }}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center md:items-end md:pr-12 md:text-right">
          <h2 className="text-2xl md:text-4xl font-bold text-[#171717] mb-4 md:mb-6 drop-shadow-lg">
            Ready to take off?
          </h2>
          <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
            <a
              href="/services"
              className="px-4 py-2 md:px-8 md:py-3 rounded border border-white text-[#849c22] font-semibold bg-transparent hover:bg-white hover:text-teal-700 transition text-base md:text-lg shadow whitespace-nowrap"
            >
              Explore flights
            </a>
            <a
              href="/products"
              className="px-4 py-2 md:px-8 md:py-3 rounded bg-white text-teal-700 font-semibold hover:bg-[#849c22] hover:text-white transition text-base md:text-lg shadow whitespace-nowrap"
            >
              Travel essentials
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
