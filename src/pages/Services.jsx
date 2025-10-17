import React from "react";
import lineWoman11 from "../assets/line-woman11.png";
import lineWoman12 from "../assets/line-woman12.png";
import lineWoman13 from "../assets/line-woman13.png";
import SEOHead from "../components/SEOHead";

const services = [
  {
    title: "Aufräumhilfe",
    description:
      "Professionelle Unterstützung beim Aufräumen und Organisieren.",
    image: lineWoman11,
  },
  {
    title: "Alltagsbegleitung",
    description:
      "Begleitung und Unterstützung im Alltag für mehr Lebensqualität.",
    image: lineWoman12,
  },
  {
    title: "Umzugsvorpacken",
    description: "Hilfe beim Vorbereiten und Packen für den Umzug.",
    image: lineWoman13,
  },
  {
    title: "Gesellschaftlerin",
    description: "Gesellschaft leisten und soziale Kontakte fördern.",
    image: lineWoman11,
  },
];

export default function Services() {
  return (
    <>
      <SEOHead
        title="Services - Vision To Go"
        description="Professional services including organization help, daily assistance, moving preparation, and companionship at The Grrrls Club."
        keywords="services, organization, assistance, moving, companionship, support"
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                  Our Services
                </h1>
                <p className="text-xl text-[#171717] mb-8">
                  Professional support services to make your life easier and
                  more organized.
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={lineWoman11}
                    alt="Service illustration"
                    className="w-16 h-16 rounded-full object-cover border-4 border-pink-300"
                  />
                  <span className="text-lg font-semibold text-gray-700">
                    Quality Service Guaranteed
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src={lineWoman12}
                  alt="Services illustration"
                  className="max-w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                What We Offer
              </h2>
              <p className="text-lg text-[#171717]">
                Comprehensive services tailored to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center"
                >
                  <div className="mb-4">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-pink-200"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[#171717] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with improved positioning and blur effect */}
        <section className="relative py-16 bg-white overflow-hidden">
          {/* Background blur effect */}
          <div className="absolute inset-0 bg-white"></div>

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Text content */}
              <div className="text-center lg:text-left lg:flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#171717] mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-[#171717] mb-8">
                  Contact us today to learn more about our services
                </p>
                <button className="bg-gradient-to-r from-[#849c22] to-[#6b7e1c] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#6b7e1c] hover:to-[#849c22] transition-all duration-300">
                  Contact Us
                </button>
              </div>

              {/* Image with blur background effect */}
              <div className="relative lg:flex-shrink-0">
                <div className="relative">
                  {/* Main image */}
                  <img
                    src={lineWoman13}
                    alt="Contact illustration"
                    className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
