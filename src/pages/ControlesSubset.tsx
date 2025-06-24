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
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-6 py-3 rounded-lg font-bold transition-all shadow-lg ${
            modo === 'comunidad' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          onClick={() => setModo('comunidad')}
        >
          � Versión Comunidad
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-bold transition-all shadow-lg ${
            modo === 'propio' ? 'bg-green-500 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          onClick={() => setModo('propio')}
        >
          ✨ Mi Versión
        </button>
      </div>

      <div className="bg-black/20 p-6 rounded-xl border-2 border-yellow-400 shadow-xl">
        <div className="flex flex-wrap justify-center items-end gap-4">
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="px-4 py-3 rounded-lg text-white bg-black/70 border-2 border-purple-400 font-mono w-64"
              placeholder="Ej: 3,4,5,6"
            />
            <label className="text-white text-sm mt-2 font-bold">Conjunto</label>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="px-4 py-3 rounded-lg text-white bg-black/70 border-2 border-blue-400 font-mono w-32"
              placeholder="Objetivo"
            />
            <label className="text-white text-sm mt-2 font-bold">Target</label>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={ejecutarAlgoritmo}
              disabled={running}
              className={`px-6 py-3 rounded-lg font-bold transition-all shadow-lg ${
                running ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105'
              } text-white`}
            >
              {running ? '🔮 Calculando...' : '🚀 Ejecutar Algoritmo'} GO!
            </button>
            {!running && (
              <div className="text-xs text-gray-300 mt-2 text-center">
                <p>Máx elementos: {modo === 'comunidad' ? '10' : '20'}</p>
              </div>
            )}
          </div>
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