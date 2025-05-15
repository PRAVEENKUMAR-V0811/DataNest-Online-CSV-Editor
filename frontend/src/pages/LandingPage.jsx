import React from 'react'

import HeroImg from "../assets/heroimg.png";
import logo from "../assets/logo2.png";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();


    const handleCTA = () => {
      navigate("/dashboard");
    };

    const handleContact = () => {
      navigate("/contact");
    };

    const handleHome = () => {
      navigate("/");
    };
  return (
    <div className="w-full min-h-full bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center">
        <div onClick={handleHome} className="flex items-center gap-2 text-xl font-bold cursor-pointer">
        <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
        <span>DataNest</span>
        </div>          
          <button
            className="bg-[#E0F2FE] text-sm font-semibold text-[#1F2937] px-7 py-2.5 rounded-lg hover:bg-[#1F2937] hover:text-white transition-colors cursor-pointer"
            onClick={handleContact}
          >
            Contact Us
          </button>
        </header>

        {/* Hero Content */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              CSV Editing Made{" "}
              <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine">
                Surprisingly Simple.
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Everything runs in your browser - <span className="text-[#66c408]"><strong>No downloads, No signups, No hassle.</strong></span>
            </p>
            <button
              className="bg-black text-sm font-semibold text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src={HeroImg}
              alt="Hero Image"
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-5">
          <h2 className="text-2xl font-bold text-center mb-12">
            Features That Make You Stand Out
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-3">Easy Editing</h3>
              <p className="text-gray-600">
                Edit your data directly in a clean, spreadsheet-style table with live updates.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-3">
                Create From Scratch
              </h3>
              <p className="text-gray-600">
                    Start with a blank table and build your CSV file your way.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-3">
                Seamless Import and Export
              </h3>
              <p className="text-gray-600">
                Quickly upload any delimited file and export your cleaned data to CSV, Excel, or PDF with one click.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="text-sm bg-gray-50 text-secondary text-center p-5 mt-5">
          Made with ❤️... Crafted to simplify your data journey.
      </div>
    </div>
  )
}

export default LandingPage

