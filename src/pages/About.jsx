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
          در
          fetchpriority="high"
          decoding="async"
        />
        <div
          className="absolute left-0 top-0 h-full flex flex-col justify-center pl-3 md:pl-8 bg-gradient-to-r from-white/80 to-transparent"
          style={{ width: "45%", maxWidth: "600px" }}
        >
          <h1 className="text-xl md:text-4xl font-bold mb-2 md:mb-4 leading-snug">
            Girl&apos;s Club is your platform for pre-owned pieces you’ll love
          </h1>
          <h3 className="text-sm md:text-xl font-medium">
            One community, thousands of brands, and a whole lot of second-hand
            style. Ready to get started? Here’s how it works.
          </h3>
        </div>
      </div>

      {/* Selling is simple section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className="flex items-end mb-8">
          <h2 className="text-2xl font-bold flex-1 text-left">
            Selling is simple
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={about01}
              alt="List for free"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">1. List for free</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Download the Vinted app for free. Take photos of your item,
              describe it, and set your price. Tap “Upload” and your listing is
              live.
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
              alt="Sell it, ship it"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">2. Sell it, ship it</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Sold! Box your item, print your prepaid shipping label, and pop to
              the drop-off point within 5 days.
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
              alt="It’s payday!"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">3. It’s payday!</h3>
            <p className="mb-4 text-gray-700 text-sm">
              There are zero selling fees, so what you earn is yours to keep.
              You’ll be paid as soon as the buyer confirms everything’s OK.
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
            href="/products"
            className="px-8 py-3 rounded border border-teal-700 text-teal-700 font-semibold hover:bg-[#849c22] hover:text-white transition text-lg shadow-sm"
          >
            Start selling
          </a>
        </div>
      </div>
      {/* خط نازک خاکستری */}
      <hr className="my-16 border-gray-200" />

      {/* Shop safely and securely section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className="flex items-end mb-8">
          <h2 className="text-2xl font-bold flex-1 text-left">
            Shop safely and securely
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={about04}
              alt="Find it"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">1. Find it</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Download the Vinted app for free. Browse millions of unique items,
              search thousands of brands, and find your favourites.
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
              alt="Buy it"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">2. Buy it</h3>
            <p className="mb-4 text-gray-700 text-sm">
              Ask the seller any questions, then buy with the tap of a button.
              Pay securely via PayPal, bank card, Apple Pay or your Vinted
              Balance.
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
              alt="Get it"
              className="rounded-lg w-full max-w-xs mb-4 shadow"
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-bold text-lg mb-2">3. Get it</h3>
            <p className="mb-4 text-gray-700 text-sm">
              You’ll see your item’s estimated delivery date at checkout, and
              we’ll let you know when it’s in the post. In a few days, it’ll be
              with you.
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
            Start shopping
          </a>
        </div>
      </div>

      {/* خط نازک خاکستری */}
      <hr className="my-16 border-gray-200" />

      {/* You’re safe with us section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-left">
          You’re safe with us
        </h2>
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
              <h3 className="font-bold text-lg mb-1">
                Shop with peace of mind
              </h3>
              <p className="mb-2 text-gray-700 text-sm">
                As a buyer, you pay a Buyer Protection fee on each transaction
                when using the "Buy now" button. This helps safeguard your
                money, adding an extra layer of protection to your purchases and
                keeping your information secure. The cost is 5% of the item
                price plus 0,70 €.
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
              <h3 className="font-bold text-lg mb-1">Reliable refund policy</h3>
              <p className="mb-2 text-gray-700 text-sm">
                Your order is protected when you pay through Vinted. You’ll get
                a refund if your item doesn’t arrive, was damaged in transit, or
                is significantly not as described. Let us know within 2 days of
                delivery if something isn’t right. Unless otherwise agreed, the
                buyer covers the return cost.
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
            Ready to go?
          </h2>
          <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
            <a
              href="/products"
              className="px-4 py-2 md:px-8 md:py-3 rounded border border-white text-[#849c22] font-semibold bg-transparent hover:bg-white hover:text-teal-700 transition text-base md:text-lg shadow whitespace-nowrap"
            >
              Start shopping
            </a>
            <a
              href="/sell"
              className="px-4 py-2 md:px-8 md:py-3 rounded bg-white text-teal-700 font-semibold hover:bg-[#849c22] hover:text-white transition text-base md:text-lg shadow whitespace-nowrap"
            >
              Start selling
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
