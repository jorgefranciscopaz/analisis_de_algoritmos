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
  target,
  modo,
  recursionCalls
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
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P:wght@400&display=swap');
          
          .font-arcade {
            font-family: 'Press Start 2P', monospace;
            text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
          }
          
          .text-shadow-strong {
            text-shadow: 3px 3px 0px rgba(0,0,0,0.9), 1px 1px 0px rgba(0,0,0,0.8);
          }
          
          .text-shadow-medium {
            text-shadow: 2px 2px 0px rgba(0,0,0,0.8), 1px 1px 0px rgba(0,0,0,0.6);
          }
          
          .text-shadow-glow {
            text-shadow: 0 0 10px currentColor, 2px 2px 0px rgba(0,0,0,0.8);
          }
          
          .bg-grid-pattern {
            background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          
          .border-3 {
            border-width: 3px;
          }
        `}
      </style>
      
      <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700 pb-4">
        <div className="space-y-4">
          {result !== null && (
            <div className={`p-6 rounded-2xl border-4 ${
              result 
                ? 'bg-gradient-to-br from-green-800/80 via-green-700/80 to-emerald-800/80 border-green-400/70' 
                : 'bg-gradient-to-br from-red-800/80 via-red-700/80 to-rose-800/80 border-red-400/70'
            } animate-bounce-in mx-auto max-w-2xl shadow-2xl relative overflow-hidden backdrop-blur-sm`}>
              
              {/* Efecto de brillo animado */}
              <div className="absolute inset-0 opacity-20">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full animate-shimmer"
                ></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-center text-white font-arcade text-shadow-strong mb-3">
                  {result ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-bounce text-3xl">✅</span>
                      <span className="bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
                        ¡OBJETIVO ALCANZABLE!
                      </span>
                      <span className="animate-bounce text-3xl">✅</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-pulse text-3xl">❌</span>
                      <span className="bg-gradient-to-r from-red-200 to-rose-100 bg-clip-text text-transparent">
                        OBJETIVO NO ALCANZABLE
                      </span>
                      <span className="animate-pulse text-3xl">❌</span>
                    </span>
                  )}
                </h2>
                
                {result && subconjunto.length > 0 && (
                  <div className="bg-black/50 p-4 rounded-xl border-2 border-yellow-400/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-400/20 to-yellow-500/20 animate-gradient-x"></div>
                    <p className="text-center text-yellow-200 font-bold text-lg font-arcade text-shadow-medium relative z-10">
                      🎯 SUBCONJUNTO: 
                      <span className="text-yellow-100 font-mono bg-black/40 px-3 py-1 rounded-lg ml-2 border border-yellow-400/30">
                        [{subconjunto.join(', ')}]
                      </span>
                    </p>
                  </div>
                )}
                
                {modo === 'comunidad' && recursionCalls && (
                  <div className="mt-3 bg-purple-500/30 p-3 rounded-xl border-2 border-purple-300/50">
                    <p className="text-center text-purple-100 font-bold text-sm font-arcade text-shadow-medium">
                      <span className="animate-spin inline-block mr-2">🔄</span>
                      LLAMADAS RECURSIVAS: 
                      <span className="text-purple-200 bg-black/40 px-2 py-1 rounded ml-2 border border-purple-400/30">
                        {recursionCalls.length}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {modo === 'propio' && showExplanation && (
            <div className="bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70 p-6 rounded-2xl border-4 border-green-400/70 animate-fade-in max-w-2xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-sm">
              
              {/* Grid de fondo */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-green-400 mb-4 text-center font-arcade text-shadow-glow flex items-center justify-center gap-3">
                  <span className="animate-bounce text-2xl">📝</span>
                  EXPLICACIÓN DETALLADA
                </h3>
                <div className="bg-black/60 p-4 rounded-xl border-2 border-green-300/40">
                  <p className="text-white text-base text-center font-semibold text-shadow-medium leading-relaxed">
                    {currentExplanation || (
                      <span className="text-gray-300 italic">
                        🔍 Selecciona 'Mostrar Explicación' para ver los pasos detallados del algoritmo.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {modo === 'propio' && (
            <>
              {(step >= 1 || !running) && leftPart.length > 0 && (
                <div className="flex justify-center space-x-4 animate-fade-in-up">
                  <div className="bg-gradient-to-br from-blue-800/60 via-blue-700/60 to-cyan-800/60 p-4 rounded-2xl border-4 border-blue-400/70 min-w-0 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>
                    <h3 className="text-lg mb-3 font-bold text-blue-100 text-center font-arcade text-shadow-strong relative z-10 flex items-center justify-center gap-2">
                      <span className="animate-pulse">🔹</span> IZQUIERDA
                    </h3>
                    <div className="flex space-x-2 flex-wrap justify-center relative z-10">
                      {trailLeft.map((style, idx) => (
                        <ApproxCell key={idx} value={leftPart[idx]} highlight={false} style={style} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center px-4">
                    <div className="text-6xl animate-bounce text-white text-shadow-strong">➡️</div>
                  </div>

                  <div className="bg-gradient-to-br from-red-800/60 via-red-700/60 to-rose-800/60 p-4 rounded-2xl border-4 border-red-400/70 min-w-0 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
                    <h3 className="text-lg mb-3 font-bold text-red-100 text-center font-arcade text-shadow-strong relative z-10 flex items-center justify-center gap-2">
                      <span className="animate-pulse">🔸</span> DERECHA
                    </h3>
                    <div className="flex space-x-2 flex-wrap justify-center relative z-10">
                      {trailRight.map((style, idx) => (
                        <ApproxCell key={idx} value={rightPart[idx]} highlight={false} style={style} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(step >= 2 || !running) && leftSums.length > 0 && (
                <div className="bg-gradient-to-br from-blue-800/60 via-blue-700/60 to-cyan-800/60 p-5 rounded-2xl border-4 border-blue-400/70 max-w-4xl mx-auto animate-fade-in-up shadow-2xl backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>
                  <h3 className="text-center font-bold mb-4 text-blue-100 text-xl font-arcade text-shadow-strong relative z-10 flex items-center justify-center gap-3">
                    <span className="animate-bounce text-2xl">🔹</span>
                    SUMAS LADO IZQUIERDO
                    <span className="animate-bounce text-2xl">🔹</span>
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto relative z-10 bg-black/40 p-3 rounded-xl border-2 border-blue-300/40">
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
                <div className="bg-gradient-to-br from-red-800/60 via-red-700/60 to-rose-800/60 p-5 rounded-2xl border-4 border-red-400/70 max-w-4xl mx-auto animate-fade-in-up shadow-2xl backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
                  <h3 className="text-center font-bold mb-4 text-red-100 text-xl font-arcade text-shadow-strong relative z-10 flex items-center justify-center gap-3">
                    <span className="animate-bounce text-2xl">🔸</span>
                    SUMAS LADO DERECHO
                    <span className="animate-bounce text-2xl">🔸</span>
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto relative z-10 bg-black/40 p-3 rounded-xl border-2 border-red-300/40">
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
                <div className="bg-gradient-to-br from-green-800/60 via-emerald-700/60 to-teal-800/60 p-5 rounded-2xl border-4 border-green-400/70 max-w-4xl mx-auto animate-fade-in-up shadow-2xl backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>
                  <h3 className="text-center font-bold mb-4 text-green-100 text-xl font-arcade text-shadow-strong relative z-10 flex items-center justify-center gap-3">
                    <span className="animate-spin text-2xl">🎯</span>
                    SUMAS COMBINADAS FINALES
                    <span className="animate-spin text-2xl">🎯</span>
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto relative z-10 bg-black/40 p-3 rounded-xl border-2 border-green-300/40">
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
            </>
          )}

          {result && subconjunto.length > 0 && (
            <div className="p-6 bg-gradient-to-br from-green-600/80 via-emerald-600/80 to-teal-600/80 rounded-2xl border-4 border-green-400/70 shadow-2xl animate-bounce-in mx-auto max-w-2xl relative overflow-hidden backdrop-blur-sm">
              
              {/* Efecto de brillo dinámico */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/40 via-emerald-300/40 to-teal-400/40 animate-gradient-x"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-center text-white font-arcade text-shadow-strong mb-4 flex items-center justify-center gap-3">
                  <span className="animate-spin text-3xl">✨</span>
                  SOLUCIÓN ENCONTRADA
                  <span className="animate-spin text-3xl">✨</span>
                </h3>
                
                <div className="flex justify-center mt-4">
                  <div className="bg-black/60 p-4 rounded-xl border-4 border-yellow-400/70 relative overflow-hidden">
                    <div className="absolute inset-0 bg-yellow-500/20 animate-pulse"></div>
                    <p className="text-white font-mono text-xl text-center font-bold text-shadow-medium relative z-10">
                      <span className="text-yellow-300">[</span>
                      <span className="text-green-200">{subconjunto.join(', ')}</span>
                      <span className="text-yellow-300">]</span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 bg-purple-500/40 p-3 rounded-xl border-2 border-purple-300/50">
                  <p className="text-center text-white text-lg font-bold font-arcade text-shadow-medium">
                    <span className="animate-bounce inline-block mr-2">🎯</span>
                    SUMA TOTAL: 
                    <span className="text-yellow-200 bg-black/50 px-3 py-1 rounded-lg ml-2 border border-yellow-400/40">
                      {subconjunto.reduce((a, b) => a + b, 0)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultadoSubset;