import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuInicio: FC = () => {
  const navigate = useNavigate();

  const algoritmos = [
    {
      nombre: 'ALGORITMO 1',
      fondo: "url('./images/algoritmo1.jpg')",
      ruta: '/algoritmo1',
    },
    {
      nombre: 'ALGORITMO 2',
      fondo: "url('./images/algoritmo2.jpg')",
      ruta: '/algoritmo2',
    },
    {
      nombre: 'ALGORITMO 3',
      fondo: "url('./images/algoritmo3.jpg')",
      ruta: '/algoritmo3',
    },
  ];

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {algoritmos.map((alg, index) => (
        <div
          key={index}
          className="flex-1 relative group cursor-pointer bg-cover bg-center transition-all duration-500 transform hover:scale-105"
          style={{ backgroundImage: alg.fondo }}
          onClick={() => {
            const page = document.querySelector('body');
            if (page) page.classList.add('fade-out');
            setTimeout(() => navigate(alg.ruta), 300);
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition duration-300" />
          <div className="relative z-10 flex h-full items-center justify-center">
            <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-xl transition-opacity duration-300 group-hover:opacity-90">
              {alg.nombre}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuInicio;
