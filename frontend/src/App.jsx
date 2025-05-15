import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import DashBoard from './pages/Home/DashBoard';
import ContactUs from './pages/Contact/ContactUs';
import CSVEditor from './pages/Editor/CSVEditor';

const App = () => {
  return (
    <>
    <div>
      <Router>
        <Routes>
          {/* Default Route - Landing Page */}
          <Route path="/" element={<LandingPage />}/>

          {/* Other Routes */}
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/create-csv" element={<CSVEditor />} />
        </Routes>
      </Router>
    </div>

    <Toaster
      toastOptions={{
        className:"w-auto h-auto p-4 text-sm rounded shadow-lg bg-white text-black",
        duration: 2000,
        style: {
          fontSize: "16px",
          border: '1px solid #e2e8f0',
        },
      }}
      position="top-center"
    />
    
    </>
  )
}

export default App