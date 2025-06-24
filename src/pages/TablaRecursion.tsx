import React, { useEffect, useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

const RecursionCall = ({ call, index, isVisible, isCurrentStep }) => {
  const anim = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px) scale(1)' : 'translateY(20px) scale(0.95)',
    from: { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
    delay: call.delay || index * 50,
    config: config.gentle,
  });

  const pulseAnim = useSpring({
    transform: isCurrentStep ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isCurrentStep 
      ? '0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(59, 130, 246, 0.3)' 
      : '0 4px 15px rgba(0, 0, 0, 0.3)',
    config: config.wobbly,
  });

  const getBackgroundGradient = () => {
    if (call.isBaseCase) {
      return call.result 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }
    if (call.result === true) return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    if (call.result === false) return 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
    return 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)';
  };

  const getCallIcon = () => {
    if (call.isBaseCase) {
      return call.result ? '🎯' : '💥';
    }
    if (call.result === true) return '✨';
    if (call.result === false) return '❌';
    return '🔄';
  };

  const getBorderColor = () => {
    if (call.isBaseCase) {
      return call.result ? '#10b981' : '#ef4444';
    }
    if (call.result === true) return '#3b82f6';
    if (call.result === false) return '#94a3b8';
    return '#7c3aed';
  };

  return (
    <animated.div
      className="mb-3 relative"
      style={{
        ...anim,
        marginLeft: `${call.depth * 25}px`,
      }}
    >
      <animated.div
        className="p-4 rounded-xl border-2 text-white relative overflow-hidden backdrop-blur-sm"
        style={{
          ...pulseAnim,
          background: getBackgroundGradient(),
          borderColor: getBorderColor(),
        }}
      >
        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full"
            style={{
              animation: 'shimmer 2s infinite'
            }}
          ></div>
        </div>

        {/* Header de la llamada */}
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">{getCallIcon()}</span>
            <div>
              <div className="font-bold text-lg flex items-center gap-2 text-white drop-shadow-lg">
                <span className="bg-white/30 px-2 py-1 rounded-full text-sm font-bold">#{call.id}</span>
                <span className="text-white font-bold drop-shadow-md">Profundidad {call.depth}</span>
              </div>
              <div className="text-sm mt-1">
                <span className="bg-black/40 px-2 py-1 rounded text-white font-semibold drop-shadow-md">
                  isSubsetSum(n={call.n}, sum={call.sum})
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {call.result !== null && (
              <div className={`font-bold text-lg px-3 py-1 rounded-full border-2 drop-shadow-lg ${
                call.result 
                  ? 'bg-green-500/40 text-green-100 border-green-300' 
                  : 'bg-red-500/40 text-red-100 border-red-300'
              }`}>
                {call.result ? '✅ TRUE' : '🚫 FALSE'}
              </div>
            )}
          </div>
        </div>

        {/* Contenido de la llamada */}
        <div className="mt-3 relative z-10">
          {call.isBaseCase ? (
            <div className="bg-black/40 p-3 rounded-lg border border-white/30">
              <div className="flex items-center gap-2">
                <span className="text-yellow-200 font-bold drop-shadow-md">🔚 CASO BASE:</span>
                <span className="italic text-white font-semibold drop-shadow-sm">{call.baseReason}</span>
              </div>
            </div>
          ) : call.action ? (
            <div className="bg-black/40 p-3 rounded-lg border border-white/30">
              <div className="flex items-center gap-2">
                <span className="text-blue-200 font-bold drop-shadow-md">⚡ ACCIÓN:</span>
                <span className="text-white font-semibold drop-shadow-sm">{call.action}</span>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 p-3 rounded-lg border border-white/30">
              <div className="flex items-center gap-2">
                <span className="text-purple-200 font-bold drop-shadow-md">🔄 EVALUANDO...</span>
              </div>
            </div>
          )}
          
          {/* Path actual */}
          {call.path && call.path.length > 0 && (
            <div className="mt-2 bg-purple-500/30 p-2 rounded-lg border border-purple-300/40">
              <span className="text-purple-100 font-semibold drop-shadow-md">🛤️ Camino actual: </span>
              <span className="text-yellow-200 font-mono font-bold drop-shadow-sm">[{call.path.join(', ')}]</span>
            </div>
          )}

          {/* Resultados de include/exclude */}
          {call.includeResult !== undefined && call.excludeResult !== undefined && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className={`p-2 rounded-lg border-2 ${
                call.excludeResult 
                  ? 'bg-green-500/30 border-green-300 text-green-100' 
                  : 'bg-red-500/30 border-red-300 text-red-100'
              }`}>
                <div className="text-xs font-semibold drop-shadow-md">EXCLUIR</div>
                <div className="font-bold drop-shadow-sm">{call.excludeResult ? '✅ TRUE' : '❌ FALSE'}</div>
              </div>
              <div className={`p-2 rounded-lg border-2 ${
                call.includeResult 
                  ? 'bg-green-500/30 border-green-300 text-green-100' 
                  : 'bg-red-500/30 border-red-300 text-red-100'
              }`}>
                <div className="text-xs font-semibold drop-shadow-md">INCLUIR</div>
                <div className="font-bold drop-shadow-sm">{call.includeResult ? '✅ TRUE' : '❌ FALSE'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Línea de conexión para mostrar jerarquía */}
        {call.depth > 0 && (
          <div className="absolute -left-6 top-6 w-6 h-0.5 bg-white/50"></div>
        )}
      </animated.div>
    </animated.div>
  );
};

// Nuevo componente para vista de árbol visual
const VisualTree = ({ recursionCalls, visibleCalls }) => {
  const [nodes, setNodes] = useState([]);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const visibleNodes = recursionCalls.slice(0, visibleCalls);
    
    // Calcular posiciones de árbol más inteligente
    const positionedNodes = [];
    const levelCounts = {}; // Contador de nodos por nivel
    const levelPositions = {}; // Posiciones usadas por nivel
    
    visibleNodes.forEach((call, index) => {
      const level = call.depth;
      
      // Inicializar contadores para este nivel si no existen
      if (!levelCounts[level]) {
        levelCounts[level] = 0;
        levelPositions[level] = 0;
      }
      
      // Calcular posición X basada en la profundidad y posición en el nivel
      const baseX = 100;
      const levelSpacing = 150;
      const nodeSpacing = 100;
      
      const x = baseX + (level * levelSpacing);
      const y = 80 + (levelPositions[level] * nodeSpacing);
      
      positionedNodes.push({
        ...call,
        x: x,
        y: y,
        visible: true,
        level: level,
        positionInLevel: levelPositions[level]
      });
      
      levelPositions[level]++;
      levelCounts[level]++;
    });
    
    // Calcular dimensiones del SVG basadas en los nodos
    const maxX = Math.max(...positionedNodes.map(n => n.x)) + 150;
    const maxY = Math.max(...positionedNodes.map(n => n.y)) + 100;
    
    setSvgDimensions({ width: Math.max(800, maxX), height: Math.max(600, maxY) });
    setNodes(positionedNodes);
  }, [recursionCalls, visibleCalls]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-6 border-4 border-cyan-400/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <h4 className="text-2xl font-bold text-white mb-4 text-center font-arcade drop-shadow-lg">
        🌐 Vista de Árbol Visual 🌐
      </h4>
      
      <div className="relative w-full h-96 overflow-auto bg-black/20 rounded-xl border-2 border-white/20">
        <svg 
          width={svgDimensions.width} 
          height={svgDimensions.height} 
          className="min-w-full min-h-full"
          viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
        >
          {/* Grid de fondo */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Líneas de conexión */}
          {nodes.map((node, index) => {
            // Buscar el nodo padre más apropiado
            const potentialParents = nodes.filter(n => 
              n.depth === node.depth - 1 && 
              n.id < node.id
            );
            
            const parent = potentialParents[potentialParents.length - 1]; // Tomar el más reciente
            
            if (parent) {
              return (
                <animated.line
                  key={`line-${node.id}`}
                  x1={parent.x + 40}
                  y1={parent.y + 40}
                  x2={node.x + 40}
                  y2={node.y + 40}
                  stroke="rgba(100,255,255,0.7)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                  style={{
                    filter: 'drop-shadow(0 0 5px rgba(100,255,255,0.5))'
                  }}
                />
              );
            }
            return null;
          })}
          
          {/* Nodos */}
          {nodes.map((node, index) => {
            const nodeColor = node.isBaseCase 
              ? (node.result ? '#10b981' : '#ef4444')
              : (node.result === true ? '#3b82f6' : node.result === false ? '#94a3b8' : '#7c3aed');
            
            const strokeColor = node.isBaseCase 
              ? (node.result ? '#34d399' : '#f87171')
              : (node.result === true ? '#60a5fa' : node.result === false ? '#a8a29e' : '#a78bfa');
            
            return (
              <g key={node.id}>
                {/* Círculo exterior con glow */}
                <circle
                  cx={node.x + 40}
                  cy={node.y + 40}
                  r="38"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2"
                  opacity="0.5"
                  className="animate-pulse"
                />
                
                {/* Nodo principal */}
                <animated.circle
                  cx={node.x + 40}
                  cy={node.y + 40}
                  r="32"
                  fill={nodeColor}
                  stroke="white"
                  strokeWidth="3"
                  style={{
                    filter: `drop-shadow(0 0 15px ${nodeColor})`
                  }}
                />
                
                {/* Texto del nodo */}
                <text
                  x={node.x + 40}
                  y={node.y + 30}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  className="drop-shadow-lg"
                >
                  n={node.n}
                </text>
                <text
                  x={node.x + 40}
                  y={node.y + 45}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                  className="drop-shadow-lg"
                >
                  s={node.sum}
                </text>
                
                {/* Icono de resultado */}
                <text
                  x={node.x + 65}
                  y={node.y + 20}
                  textAnchor="middle"
                  fontSize="16"
                  className="animate-bounce"
                >
                  {node.isBaseCase 
                    ? (node.result ? '🎯' : '💥')
                    : (node.result === true ? '✨' : node.result === false ? '❌' : '🔄')
                  }
                </text>
                
                {/* ID del nodo */}
                <text
                  x={node.x + 40}
                  y={node.y + 75}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="8"
                  fontWeight="bold"
                >
                  #{node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Leyenda */}
      <div className="mt-4 flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
          <span className="text-white font-semibold">Éxito</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white"></div>
          <span className="text-white font-semibold">Fallo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          <span className="text-white font-semibold">Base Éxito</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
          <span className="text-white font-semibold">Base Fallo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
          <span className="text-white font-semibold">Procesando</span>
        </div>
      </div>
    </div>
  );
};

const TablaRecursion = ({ recursionCalls, input, target }) => {
  const [visibleCalls, setVisibleCalls] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'tree'

  useEffect(() => {
    if (recursionCalls.length > 0) {
      setVisibleCalls(0);
      setCurrentStep(0);
      setIsPlaying(true);
    }
  }, [recursionCalls]);

  useEffect(() => {
    if (isPlaying && visibleCalls < recursionCalls.length) {
      const timer = setTimeout(() => {
        setVisibleCalls(prev => prev + 1);
        setCurrentStep(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (visibleCalls >= recursionCalls.length) {
      setIsPlaying(false);
    }
  }, [visibleCalls, recursionCalls.length, isPlaying, speed]);

  const resetAnimation = () => {
    setVisibleCalls(0);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const showAll = () => {
    setIsPlaying(false);
    setVisibleCalls(recursionCalls.length);
    setCurrentStep(recursionCalls.length);
  };

  if (recursionCalls.length === 0) return null;

  const totalCalls = recursionCalls.length;
  const successfulCalls = recursionCalls.filter(call => call.result === true).length;
  const baseCases = recursionCalls.filter(call => call.isBaseCase).length;
  const maxDepth = Math.max(...recursionCalls.map(call => call.depth));

  const headerAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(-20px)' },
    config: config.gentle,
  });

  const customStyles = {
    fontFamily: '"Press Start 2P", monospace',
    textShadow: '2px 2px 0px rgba(0,0,0,0.8)'
  };

  return (
    <div className="flex flex-col items-center w-full">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P:wght@400&display=swap');
          
          .font-arcade {
            font-family: 'Press Start 2P', monospace;
            text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
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

      <animated.div 
        className="w-full bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md p-8 rounded-2xl border-2 border-cyan-400/50 shadow-2xl relative overflow-hidden"
        style={headerAnimation}
      >
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20"
            style={{ 
              backgroundSize: '200% 200%', 
              animation: 'gradient-x 3s ease infinite' 
            }}
          ></div>
        </div>

        <div className="text-center mb-6 relative z-10">
          <h3 className="text-4xl font-extrabold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
            🌳 Árbol de Recursión Dinámico
          </h3>
          <div className="text-lg text-cyan-100 mb-4">
            <p className="bg-black/30 inline-block px-4 py-2 rounded-full border border-cyan-400/30">
              📊 Conjunto: <span className="text-yellow-200 font-mono font-bold">[{input}]</span> | 
              🎯 Objetivo: <span className="text-green-200 font-bold">{target}</span>
            </p>
          </div>
        </div>

        {/* Controles mejorados */}
        <div className="flex justify-center gap-4 mb-6 relative z-10 flex-wrap">
          <button
            onClick={resetAnimation}
            className="bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:from-green-300 hover:via-green-400 hover:to-green-500 
                       px-6 py-3 rounded-xl font-bold text-white text-sm border-4 border-green-300/50 
                       shadow-[0_8px_0_#16a34a,0_12px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#16a34a,0_8px_15px_rgba(0,0,0,0.3)] 
                       active:shadow-[0_2px_0_#16a34a,0_4px_8px_rgba(0,0,0,0.3)] hover:translate-y-1 active:translate-y-2 
                       transition-all duration-150 transform relative overflow-hidden group"
            style={customStyles}
          >
            <span className="relative flex items-center gap-2">
              <span className="text-lg animate-spin">🔄</span> REINICIAR
            </span>
          </button>
          
          <button
            onClick={showAll}
            className="bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 hover:from-blue-300 hover:via-blue-400 hover:to-blue-500 
                       px-6 py-3 rounded-xl font-bold text-white text-sm border-4 border-blue-300/50 
                       shadow-[0_8px_0_#2563eb,0_12px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#2563eb,0_8px_15px_rgba(0,0,0,0.3)] 
                       active:shadow-[0_2px_0_#2563eb,0_4px_8px_rgba(0,0,0,0.3)] hover:translate-y-1 active:translate-y-2 
                       transition-all duration-150 transform relative overflow-hidden group"
            style={customStyles}
          >
            <span className="relative flex items-center gap-2">
              <span className="text-lg animate-bounce">⚡</span> MOSTRAR TODO
            </span>
          </button>
          
          <div className="relative">
            <select 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 hover:from-purple-300 hover:via-purple-400 hover:to-purple-500 
                         text-white px-4 py-3 rounded-xl border-4 border-purple-300/50 font-bold text-sm
                         shadow-[0_8px_0_#7c3aed,0_12px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#7c3aed,0_8px_15px_rgba(0,0,0,0.3)] 
                         hover:translate-y-1 transition-all duration-150 cursor-pointer appearance-none pr-10"
              style={customStyles}
            >
              <option value={1000} className="bg-purple-600 text-white">🐌 LENTA</option>
              <option value={500} className="bg-purple-600 text-white">🚶 NORMAL</option>
              <option value={250} className="bg-purple-600 text-white">🏃 RÁPIDA</option>
              <option value={100} className="bg-purple-600 text-white">⚡ SÚPER</option>
            </select>
          </div>

          {/* Selector de vista */}
          <div className="relative">
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value)}
              className="bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 hover:from-orange-300 hover:via-orange-400 hover:to-orange-500 
                         text-white px-4 py-3 rounded-xl border-4 border-orange-300/50 font-bold text-sm
                         shadow-[0_8px_0_#ea580c,0_12px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#ea580c,0_8px_15px_rgba(0,0,0,0.3)] 
                         hover:translate-y-1 transition-all duration-150 cursor-pointer appearance-none pr-10"
              style={customStyles}
            >
              <option value="list" className="bg-orange-600 text-white">📋 LISTA</option>
              <option value="tree" className="bg-orange-600 text-white">🌐 VISUAL</option>
            </select>
          </div>
        </div>

        {/* Panel de Stats */}
        <div className="mb-6 relative z-10">
          <div className="bg-gradient-to-r from-red-600/30 via-orange-500/30 to-yellow-500/30 p-4 rounded-2xl border-4 border-yellow-400/60 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-400/20 to-yellow-400/20 animate-pulse"></div>
            
            <div className="relative z-10 flex flex-wrap justify-center gap-6">
              <div className="bg-black/50 border-3 border-purple-400 rounded-xl p-3 min-w-[100px] text-center shadow-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-purple-200 drop-shadow-lg">{totalCalls}</div>
                <div className="text-purple-100 text-xs font-arcade drop-shadow-md">📞 LLAMADAS</div>
              </div>
              <div className="bg-black/50 border-3 border-green-400 rounded-xl p-3 min-w-[100px] text-center shadow-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-green-200 drop-shadow-lg">{successfulCalls}</div>
                <div className="text-green-100 text-xs font-arcade drop-shadow-md">✅ EXITOSAS</div>
              </div>
              <div className="bg-black/50 border-3 border-orange-400 rounded-xl p-3 min-w-[100px] text-center shadow-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-orange-200 drop-shadow-lg">{baseCases}</div>
                <div className="text-orange-100 text-xs font-arcade drop-shadow-md">🔚 CASOS BASE</div>
              </div>
              <div className="bg-black/50 border-3 border-cyan-400 rounded-xl p-3 min-w-[100px] text-center shadow-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-cyan-200 drop-shadow-lg">{maxDepth}</div>
                <div className="text-cyan-100 text-xs font-arcade drop-shadow-md">🏔️ PROFUNDIDAD</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6 relative z-10">
          <div className="bg-black/60 p-4 rounded-xl border-2 border-yellow-400/50 relative overflow-hidden">
            <div className="flex justify-between text-yellow-200 mb-2 font-arcade">
              <span className="flex items-center gap-2 drop-shadow-lg">
                <span className="animate-bounce">🚀</span> 
                PROGRESO DE RECURSIÓN
              </span>
              <span className="bg-black/50 px-3 py-1 rounded-full border border-yellow-400/50 text-yellow-100 drop-shadow-md">
                {visibleCalls} / {totalCalls}
              </span>
            </div>
            <div className="w-full bg-black/60 rounded-full h-6 border-2 border-yellow-400/30 overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${(visibleCalls / totalCalls) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm font-arcade drop-shadow-lg">
                {Math.round((visibleCalls / totalCalls) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Vista del árbol */}
        {viewMode === 'list' ? (
          <div className="bg-gradient-to-b from-black/50 to-black/70 rounded-2xl p-6 max-h-96 overflow-y-auto relative z-10 border-4 border-orange-400/50 shadow-2xl">
            <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 font-arcade text-center drop-shadow-lg">
              <span className="animate-bounce">🌲</span> 
              ÁRBOL DE RECURSIÓN 
              <span className="animate-bounce">🌲</span>
            </h4>
            
            <div className="space-y-1">
              {recursionCalls.slice(0, visibleCalls).map((call, index) => (
                <RecursionCall
                  key={call.id}
                  call={call}
                  index={index}
                  isVisible={index < visibleCalls}
                  isCurrentStep={index === visibleCalls - 1}
                />
              ))}
            </div>
          </div>
        ) : (
          <VisualTree recursionCalls={recursionCalls} visibleCalls={visibleCalls} />
        )}
      </animated.div>
    </div>
  );
};

export default TablaRecursion;