import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Import page
import Accueil from './pages/Accueil';
import NosSalons from './pages/NosSalons';
import SalonDetail from './pages/SalonDetail';
import Prestations from './pages/Prestations';
import Reservation from './pages/Reservation';
import Compte from './pages/Compte';
import Contact from './pages/Contact';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/nos-salons" element={<NosSalons />} />
          
          {/* <-- dynamic  --> */}
          <Route path="/salon/:id" element={<SalonDetail />} />
          <Route path="/prestations" element={<Prestations />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/compte" element={<Compte />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}