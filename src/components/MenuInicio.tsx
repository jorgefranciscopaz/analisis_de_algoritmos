import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuInicio: FC = () => {
  const navigate = useNavigate();

  const algoritmos = [
    {
      nombre: 'ALGORITMO 1',
      fondo: "url('./images/algoritmo1.png')",
      ruta: '/algoritmo1',
    },
    {
      nombre: 'ALGORITMO 2',
      fondo: "url('./images/algoritmo2.jpg')",
      ruta: '/algoritmo2',
    },
    {
      nombre: 'ALGORITMO 3',
      fondo: "url('./images/algoritmo3.png')",
      ruta: '/algoritmo3',
    },
  ];

  return (
    <div className="w-full h-screen flex overflown-hidden max-h-screen">
      {algoritmos.map((alg, index) => (
        <div
          key={index}
          className="flex-1 relative group cursor-pointer bg-cover bg-center grayscale transition-all duration-500 transform hover:scale-105 hover:grayscale-0"
          style={{ backgroundImage: alg.fondo }}
          onClick={() => {
            const page = document.querySelector('body');
            if (page) page.classList.add('fade-out');
            setTimeout(() => navigate(alg.ruta), 300);
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-0 transition duration-300" />
          <div className="relative z-10 flex h-full items-center justify-center">
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuInicio;
