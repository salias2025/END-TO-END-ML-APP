import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landing/landingPage';
import Login from './landing/login';
import Signup from './landing/signup';
import Dashboard from './landing/dashboard';
import PreBacPage from './pre_bac/pre_bac_page';
import BacYearPage from './bac_year/bac_year_page';
import PostBacPage from './post_bac/post_bac_page';

// Import all subject components
import Arabic from './bac_year/arabic';
import French from './bac_year/french';
import English from './bac_year/english';
import Tamazight from './bac_year/tamazight';
import LangueEtrangere from './bac_year/langue_etrangere';
import Maths from './bac_year/maths';
import Physics from './bac_year/physics';
import Science from './bac_year/science';
import Techno from './bac_year/techno';
import Gestion from './bac_year/gestion';
import Economie from './bac_year/economie';
import Loi from './bac_year/loi';
import Philo from './bac_year/philo';
import Islamia from './bac_year/islamia';
import HisGeo from './bac_year/his_geo';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pre-bac" element={<PreBacPage />} />
        <Route path="/bac-year" element={<BacYearPage />} />
        <Route path="/post-bac" element={<PostBacPage />} />

        {/* Subject Routes - Bac Year Subjects */}
        <Route path="/bac-year/subject/arabic" element={<Arabic />} />
        <Route path="/bac-year/subject/french" element={<French />} />
        <Route path="/bac-year/subject/english" element={<English />} />
        <Route path="/bac-year/subject/tamazight" element={<Tamazight />} />
        <Route path="/bac-year/subject/langue_etrangere" element={<LangueEtrangere />} />
        <Route path="/bac-year/subject/maths" element={<Maths />} />
        <Route path="/bac-year/subject/physics" element={<Physics />} />
        <Route path="/bac-year/subject/science" element={<Science />} />
        <Route path="/bac-year/subject/techno" element={<Techno />} />
        <Route path="/bac-year/subject/gestion" element={<Gestion />} />
        <Route path="/bac-year/subject/economie" element={<Economie />} />
        <Route path="/bac-year/subject/loi" element={<Loi />} />
        <Route path="/bac-year/subject/philo" element={<Philo />} />
        <Route path="/bac-year/subject/islamia" element={<Islamia />} />
        <Route path="/bac-year/subject/hisgeo" element={<HisGeo />} />
      </Routes>
    </Router>
  );
}

export default App;