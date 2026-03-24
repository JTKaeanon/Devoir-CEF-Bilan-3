import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'; 
import Footer from './components/Footer/Footer'; // 👈 On importe le Footer

export default function App() {
  return (
    <BrowserRouter>
      {/* En-tête */}
      <Navbar /> 
      
      {/* Contenu principal de la page (minHeight: 80vh pousse le footer vers le bas) */}
      <main style={{ minHeight: '80vh' }}> 
        <Routes>
          <Route path="/" element={<div style={{ padding: '50px' }}><h2>Accueil</h2></div>} />
          <Route path="/prestations" element={<div style={{ padding: '50px' }}><h2>Prestations</h2></div>} />
        </Routes>
      </main>

      {/* Pied de page */}
      <Footer /> 
    </BrowserRouter>
  );
}