// ResultadoSubset.tsx
import React from 'react';
import { useTrail, config } from '@react-spring/web';
import { ApproxCell } from './CeldaSubset';

const ResultadoSubset = ({
  result,
  subconjunto,
  showExplanation,
  currentExplanation,
  step,
  running,
  leftPart,
  rightPart,
  leftSums,
  rightSums,
  aproxValues,
  target
}) => {
  const trailLeft = useTrail(leftPart.length, {
    from: { transform: 'translateX(-200px)', opacity: 0 },
    to: { transform: 'translateX(0px)', opacity: step >= 1 ? 1 : 0 },
    config: config.slow,
  });

  const trailRight = useTrail(rightPart.length, {
    from: { transform: 'translateX(200px)', opacity: 0 },
    to: { transform: 'translateX(0px)', opacity: step >= 1 ? 1 : 0 },
    config: config.slow,
  });

  const trailLeftSums = useTrail(leftSums.length, {
    from: { transform: 'translateY(-50px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: step >= 2 ? 1 : 0 },
    config: config.slow,
  });

  const trailRightSums = useTrail(rightSums.length, {
    from: { transform: 'translateY(50px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: step >= 3 ? 1 : 0 },
    config: config.slow,
  });

  return (
    <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700 pb-4">
      <div className="space-y-3">
        {result !== null && (
          <div className={`p-3 rounded-lg ${result ? 'bg-green-900/70' : 'bg-red-900/70'} animate-bounce-in mx-auto max-w-xl`}>
            <h2 className="text-lg font-bold text-center text-white">
              {result ? '✅ ¡Objetivo alcanzable!' : '❌ Objetivo no alcanzable'}
            </h2>
            {result && subconjunto.length > 0 && (
              <p className="text-center mt-1 text-yellow-300 text-sm">
                Subconjunto: [{subconjunto.join(', ')}]
              </p>
            )}
          </div>
        )}

        {showExplanation && (
          <div className="bg-black/50 p-3 rounded-lg border border-green-400 animate-fade-in max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-green-400 mb-2 text-center">📝 Explicación</h3>
            <p className="text-white text-sm text-center">
              {currentExplanation || "Selecciona 'Mostrar Explicación' para ver los pasos detallados."}
            </p>
          </div>
        )}

        {(step >= 1 || !running) && leftPart.length > 0 && (
          <div className="flex justify-center space-x-4 animate-fade-in-up">
            <div className="bg-black/30 p-3 rounded-lg border border-blue-400 min-w-0">
              <h3 className="text-sm mb-2 font-bold text-white text-center">🔹 Izquierda</h3>
              <div className="flex space-x-1 flex-wrap justify-center">
                {trailLeft.map((style, idx) => (
                  <ApproxCell key={idx} value={leftPart[idx]} highlight={false} style={style} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center px-2">
              <ApproxCell value="" highlight={false} style={{ opacity: 1 }} isArrow={true} />
            </div>

            <div className="bg-black/30 p-3 rounded-lg border border-red-400 min-w-0">
              <h3 className="text-sm mb-2 font-bold text-white text-center">🔸 Derecha</h3>
              <div className="flex space-x-1 flex-wrap justify-center">
                {trailRight.map((style, idx) => (
                  <ApproxCell key={idx} value={rightPart[idx]} highlight={false} style={style} />
                ))}
              </div>
            </div>
          </div>
        )}

        {(step >= 2 || !running) && leftSums.length > 0 && (
          <div className="bg-black/30 p-3 rounded-lg border border-blue-400 max-w-3xl mx-auto animate-fade-in-up">
            <h3 className="text-center font-bold mb-2 text-white text-sm">🔹 Sumas Izquierda</h3>
            <div className="flex flex-wrap justify-center gap-1 max-h-24 overflow-y-auto">
              {trailLeftSums.map((style, idx) => (
                <ApproxCell 
                  key={`left-sum-${idx}`} 
                  value={leftSums[idx].sum} 
                  highlight={leftSums[idx].sum === target || (rightSums.some(rs => rs.sum === target - leftSums[idx].sum) && step >= 4)}
                  style={style} 
                />
              ))}
            </div>
          </div>
        )}

        {(step >= 3 || !running) && rightSums.length > 0 && (
          <div className="bg-black/30 p-3 rounded-lg border border-red-400 max-w-3xl mx-auto animate-fade-in-up">
            <h3 className="text-center font-bold mb-2 text-white text-sm">🔸 Sumas Derecha</h3>
            <div className="flex flex-wrap justify-center gap-1 max-h-24 overflow-y-auto">
              {trailRightSums.map((style, idx) => (
                <ApproxCell 
                  key={`right-sum-${idx}`} 
                  value={rightSums[idx].sum} 
                  highlight={rightSums[idx].sum === target || (leftSums.some(ls => ls.sum === target - rightSums[idx].sum) && step >= 4)}
                  style={style} 
                />
              ))}
            </div>
          </div>
        )}

        {(step >= 4 || !running) && aproxValues.length > 0 && (
          <div className="bg-white/10 p-3 rounded-lg border border-green-400 max-w-3xl mx-auto animate-fade-in-up">
            <h3 className="text-center font-bold mb-2 text-white text-sm">🎯 Sumas Combinadas</h3>
            <div className="flex flex-wrap justify-center gap-1 max-h-32 overflow-y-auto">
              {aproxValues.map((val, idx) => (
                <ApproxCell 
                  key={`all-${idx}`} 
                  value={val} 
                  highlight={val === target} 
                  style={{ opacity: 1 }} 
                />
              ))}
            </div>
          </div>
        )}

        {result && subconjunto.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg animate-bounce-in mx-auto max-w-xl">
            <h3 className="text-lg font-bold text-center text-white">✨ Solución</h3>
            <div className="flex justify-center mt-2">
              <div className="bg-black/30 p-2 rounded-lg">
                <p className="text-white font-mono text-center">[{subconjunto.join(', ')}]</p>
              </div>
            </div>
            <p className="text-center mt-2 text-white text-sm">Suma: {subconjunto.reduce((a, b) => a + b, 0)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultadoSubset;