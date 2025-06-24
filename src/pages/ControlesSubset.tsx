// ControlesSubset.tsx
import React from 'react';

const ControlesSubset = ({
  input,
  setInput,
  target,
  setTarget,
  modo,
  setModo,
  ejecutarAlgoritmo,
  running,
  showExplanation,
  setShowExplanation
}) => {
  return (
    <>
      <div className="flex gap-4 animate-fade-in-up bg-black/50 p-4 rounded-xl shadow-lg justify-center">
        <button 
          className={`transition-all duration-300 px-6 py-3 rounded-lg shadow-md hover:scale-105 
            ${modo === 'comunidad' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold' : 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'}`} 
          onClick={() => setModo('comunidad')}
        >
          🏆 Versión Comunidad
        </button>
        <button 
          className={`transition-all duration-300 px-6 py-3 rounded-lg shadow-md hover:scale-105 
            ${modo === 'propio' ? 'bg-gradient-to-r from-green-400 to-green-600 text-black font-bold' : 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'}`} 
          onClick={() => setModo('propio')}
        >
          ✨ Mi Versión
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-black/50 p-4 rounded-xl shadow-lg animate-fade-in-up justify-center">
        <div className="relative">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="px-4 py-3 rounded-lg text-white bg-black/70 border-2 border-purple-400 font-mono w-64" 
            placeholder="Ej: 3,4,5,6" 
          />
          <span className="absolute -top-2 left-2 bg-purple-500 text-xs px-2 rounded">Conjunto</span>
        </div>
        
        <div className="relative">
          <input 
            type="number" 
            value={target} 
            onChange={(e) => setTarget(Number(e.target.value))} 
            className="px-4 py-3 rounded-lg text-white bg-black/70 border-2 border-blue-400 font-mono w-32" 
            placeholder="Objetivo" 
          />
          <span className="absolute -top-2 left-2 bg-blue-500 text-xs px-2 rounded">Target</span>
        </div>
        
        <div className="relative flex items-center">
          <button 
            onClick={ejecutarAlgoritmo} 
            disabled={running} 
            className="bg-gradient-to-r from-red-500 to-yellow-500 hover:from-yellow-500 hover:to-red-500 font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-500 hover:scale-110 font-arcade"
          >
            {running ? '🔮 Calculando...' : '🚀 Ejecutar Algoritmo'}     GO!
          </button> 
          {!running && (
            <span className="absolute -right-4 -top-4 bg-white text-black text-xs px-2 rounded-full animate-bounce"> 
          
            </span>
          )}
        </div>
      </div>

      {modo === 'propio' && (
        <button 
          onClick={() => setShowExplanation(!showExplanation)} 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all mx-auto block"
        >
          {showExplanation ? '🙈 Ocultar Explicación' : '📖 Mostrar Explicación'}
        </button>
      )}
    </>
  );
};

export default ControlesSubset;