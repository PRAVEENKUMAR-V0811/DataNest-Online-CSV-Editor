import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import contact from "../../assets/contactus.avif";
import { FiArrowLeft } from "react-icons/fi";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    setStatus("Sending...");

    emailjs
      .send(
        "service_bss2a6h",
        "template_bg1lvnu",
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "Gw41erOgGgrGjyrIh"
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          setStatus("");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error(error);
          toast.error("Failed to send message. Try again later.");
          setStatus("");
        }
      );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left: Contact Form with logo and back */}
      <div className="md:w-1/2 flex flex-col justify-center p-8 max-w-md mx-auto">
        {/* Logo and Back Home */}
        <div className="flex items-center mb-6 cursor-pointer no-underline" onClick={goHome} title="Back to Home">
          <span className="text-[#1F2937] font-semibold  no-underline flex text-lg"><FiArrowLeft className="my-1 mr-2"/> Back Home</span>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
        {status && (
          <p className={`mb-4 ${status.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            placeholder="Your Message"
            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className=" bg-[#1F2937] text-sm font-semibold text-[#fdfdfd] px-7 py-2.5 rounded-lg hover:bg-[#E0F2FE] hover:text-black transition-colors cursor-pointer"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Right: Image + Message */}
      <div
        className="md:w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-10"
        style={{
          backgroundImage: `url(${contact})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-50 p-6 rounded max-w-sm text-center">
          <h3 className="text-3xl font-bold mb-4">We're Here to Help!</h3>
          <p className="text-lg">
            Have questions or need assistance? Send us a message and we’ll get back to you promptly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;

