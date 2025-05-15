import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is DataNest?",
    answer: "DataNest is a tool that allows you to manage, store, and share your data interactively through a chat-like interface."
  },
  {
    question: "How do I upload a file?",
    answer: "You can click the 'Upload File' button on the dashboard, select your file, and it will be processed instantly."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we prioritize data privacy and follow standard encryption practices to keep your data safe."
  },
  {
    question: "Can I export my data?",
    answer: "Absolutely! You can download your data in CSV format anytime using the 'Download' option."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-300 rounded-lg">
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50 focus:outline-none"
            >
              {faq.question}
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
