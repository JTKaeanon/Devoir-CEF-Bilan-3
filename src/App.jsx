import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'; // import navbar
export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<div style={{ padding: '50px' }}><h2>Accueil</h2></div>} />
        <Route path="/prestations" element={<div style={{ padding: '50px' }}><h2>Prestations</h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}