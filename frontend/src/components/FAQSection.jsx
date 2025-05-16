import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is DataNest?",
    answer: "DataNest is a dynamic CSV file management tool that allows users to upload, view, edit, and download CSV data through an interactive and intuitive interface."
  },
  {
    question: "How do I upload a file?",
    answer: "You can drag and drop your file or click to browse and upload it—your file will be processed instantly."
  },
  {
    question: "Is Signup required?",
    answer: "No, signup is not required. You can upload, edit, and download your files instantly without creating an account."
  },
  {
    question: "Can I create a new CSV file from scratch?",
    answer : "Absolutely! Just click “Create New File” to start building a custom CSV file with full editing capabilities."
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
