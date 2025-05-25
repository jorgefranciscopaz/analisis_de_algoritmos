import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import algoritmo1 from './pages/algoritmo1.tsx';
import algoritmo2 from './pages/algoritmo2.tsx';
import algoritmo3 from './pages/algoritmo3.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/algoritmo1" element={<algoritmo1/>} />
        <Route path="/algoritmo2" element={<algoritmo2/>} />
        <Route path="/algoritmo3" element={<algoritmo3/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
