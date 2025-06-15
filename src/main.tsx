import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Algoritmo1 from './pages/Algoritmo1';
import Algoritmo2 from './pages/Algoritmo2';
import Algoritmo3 from './pages/Algoritmo3';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/algoritmo1" element={<Algoritmo1/>} />
        <Route path="/algoritmo2" element={<Algoritmo2/>} />
        <Route path="/algoritmo3" element={<Algoritmo3/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
