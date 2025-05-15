import React from 'react'

import logo from "../assets/logo2.png";
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

    const handleUploadBtn = () => {
      navigate("/dashboard");
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
                onClick={handleUploadBtn}
              >
                Upload Existing File
              </button>
            </header>
            <hr className="border-t border-gray-300 my-5" />
           </div>
    </div>
  )
}

export default Header
