import React from 'react';
import logo from "../../assets/logo2.png";
import { useNavigate } from 'react-router-dom';
import CSVUpload from '../Uploads/CSVUpload';
import Footer from '../../components/Footer';
import FAQSection from '../../components/FAQSection';

const DashBoard = () => {

    const navigate = useNavigate();

    const handleHome = () => {
      navigate("/");
    };

    const handleCreate = () => {
      navigate("/create-csv");
    };


  return (
    <div className="w-full min-h-full bg-white md:min-w-[1200px] sm:min-w-[1200px]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center">
        <div onClick={handleHome} className="flex items-center gap-2 text-xl font-bold cursor-pointer">
        <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
        <span>DataNest</span>
        </div>
        <button
            className="bg-[#E0F2FE] text-sm font-semibold text-[#1F2937] px-7 py-2.5 rounded-lg hover:bg-[#1F2937] hover:text-white transition-colors cursor-pointer"
            onClick={handleCreate}
          >
            + New CSV File
        </button>
        </header>
        <hr className="border-t border-gray-300 my-5" />
        {/* Body */}
        <div className="px-6 py-6 text-center ">
          <h1 className="text-6xl font-semibold">Online CSV Editor <span className="text-[#66c408]">and Viewer</span></h1>
          <p className="text-gray-600 my-3 text-lg">
            Upload, view, edit, and read CSV files online with our free tool. Whether you need to make quick <br/>edits or just view your CSV data, our online CSV editor and viewer has you covered.
          </p>
        </div>
        <CSVUpload />

        {/* New Create Div */}
        <div className="text-center my-8">
          <p className="text-base text-gray-600">
            Don't have CSV File ?
          </p>
          <button
            className="my-6 bg-[#E0F2FE] text-sm font-semibold text-[#1F2937] px-7 py-2.5 rounded-lg hover:bg-[#1F2937] hover:text-white transition-colors cursor-pointer"
            onClick={handleCreate}
          >
            + Create New File
        </button>
        </div>

        {/* Features Section */}
        <section className="mt-5">
          <div className="flex justify-center items-center space-x-2 mb-12">
          <p className="text-gray-700 text-2xl font-bold text-center">Why choose our online editor. Scroll to know</p>
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
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
          <div>
            <FAQSection />
            <Footer/>
          </div>
    </div>
    
  )
}

export default DashBoard