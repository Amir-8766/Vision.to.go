import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqData = [
    {
      question: "How does shipping work?",
      answer:
        "We ship with DHL or Hermes in an environmentally friendly and plastic-free way. Standard delivery time is 2-5 business days. Shipping costs: €4.90 flat rate, free shipping from €60 order value. Pickup in Bielefeld is possible upon request.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "You can pay conveniently and securely with PayPal (fast, secure, with buyer protection), WERO (direct European payment, low fees) or prepayment (bank transfer).",
    },
    {
      question: "Can I return my order?",
      answer:
        "Yes, you have 14 days to return items (except for commission items, which are marked accordingly). Please send unworn items back in original condition. You bear the return shipping costs yourself.",
    },
    {
      question: "What are commission items?",
      answer:
        "Commission items are unique pieces or products listed on a commission basis. These are marked as such. Returns are excluded for commission items.",
    },
    {
      question: "How can I contact you?",
      answer:
        "You can reach us by email at info@thegrrrlsclub.de or through our website www.thegrrrlsclub.de. We're happy to answer your questions!",
    },
    {
      question: "Is there a minimum order quantity?",
      answer:
        "No, there is no minimum order quantity. You can also order individual items.",
    },
    {
      question: "How long does order processing take?",
      answer:
        "After payment is received, we process your order as quickly as possible. Delivery time is then 2-5 business days.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel your order as long as it hasn't been shipped yet. Just contact us by email.",
    },
    {
      question: "What happens with damaged items?",
      answer:
        "If an item arrives damaged, please contact us immediately with photos. We'll replace the item free of charge or refund the full purchase price.",
    },
    {
      question: "Are there discounts or vouchers?",
      answer:
        "Yes, we regularly offer discounts and vouchers. Follow us on Instagram @the_grrrls_club to stay informed about current offers.",
    },
  ];

  return (
    <>
      <SEOHead
        title="FAQ - Frequently Asked Questions - Vision To Go"
        description="Answers to frequently asked questions about shipping, payment, returns and more at The Grrrls Club"
        keywords="FAQ, questions, shipping, payment, returns, support, help"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions (FAQ)
            </h1>

            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-800">
                      {item.question}
                    </span>
                    {openItems[index] ? (
                      <FaChevronUp className="text-pink-600 dark:text-pink-400" />
                    ) : (
                      <FaChevronDown className="text-pink-600 dark:text-pink-400" />
                    )}
                  </button>
                  {openItems[index] && (
                    <div className="px-6 pb-4">
                      <p className="text-[#171717] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-pink-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                More Questions?
              </h2>
              <p className="text-[#171717] text-center mb-4">
                Can't find an answer to your question? Feel free to contact us!
              </p>
              <div className="text-center">
                <a
                  href="mailto:info@thegrrrlsclub.de"
                  className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
