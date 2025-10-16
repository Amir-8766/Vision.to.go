import React from "react";
import SEOHead from "../components/SEOHead";

const Impressum = () => {
  return (
    <>
      <SEOHead
        title="Legal Notice - The Grrrls Club"
        description="Legal notice for The Grrrls Club online store"
        keywords="legal notice, company information, contact, impressum"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Legal Notice
            </h1>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Information according to § 5 TMG
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-[#171717] leading-relaxed">
                    <strong>Elena Rieke</strong>
                    <br />
                    The Grrrls Club
                    <br />
                    [Street and house number]
                    <br />
                    [Postal code and city]
                    <br />
                    Germany
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Contact
                </h2>
                <div className="bg-pink-50 p-6 rounded-lg">
                  <p className="text-[#171717] leading-relaxed">
                    <strong>Phone:</strong> [Phone number]
                    <br />
                    <strong>E-Mail:</strong> info@thegrrrlsclub.de
                    <br />
                    <strong>Website:</strong> www.thegrrrlsclub.de
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  VAT ID
                </h2>
                <p className="text-[#171717] leading-relaxed">
                  VAT identification number according to § 27 a VAT Act:
                  <br />
                  [VAT ID to be added]
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Responsible for content according to § 55 Abs. 2 RStV
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-[#171717]">
                    Elena Rieke
                    <br />
                    [Street and house number]
                    <br />
                    [Postal code and city]
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Dispute Resolution
                </h2>
                <p className="text-[#171717] leading-relaxed">
                  The European Commission provides a platform for online dispute
                  resolution (ODR):
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p className="text-[#171717] leading-relaxed mt-2">
                  You can find our email address above in the legal notice.
                </p>
                <p className="text-[#171717] leading-relaxed mt-2">
                  We are not willing or obligated to participate in dispute
                  resolution proceedings before a consumer arbitration board.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Liability for Content
                </h2>
                <p className="text-[#171717] leading-relaxed">
                  As a service provider, we are responsible for our own content
                  on these pages according to general laws pursuant to § 7 para.
                  1 TMG. According to §§ 8 to 10 TMG, however, we as a service
                  provider are not under obligation to monitor transmitted or
                  stored third-party information or to investigate circumstances
                  that indicate illegal activity.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Liability for Links
                </h2>
                <p className="text-[#171717] leading-relaxed">
                  Our offer contains links to external websites of third
                  parties, on whose contents we have no influence. Therefore, we
                  cannot assume any liability for these external contents. The
                  respective provider or operator of the pages is always
                  responsible for the contents of the linked pages.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Copyright
                </h2>
                <p className="text-[#171717] leading-relaxed">
                  The contents and works created by the site operators on these
                  pages are subject to German copyright law. The reproduction,
                  editing, distribution and any kind of exploitation outside the
                  limits of copyright require the written consent of the
                  respective author or creator.
                </p>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500 text-center">
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Impressum;
