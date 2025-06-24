import React, { useState, useEffect } from 'react';
import ControlesSubset from './ControlesSubset';
import ResultadoSubset from './ResultadoSubset';
import TablaRecursion from './TablaRecursion';
import '../game-style.css';

const isSubsetSumRecursive = (arr, target) => {
  const calls = [];
  let callCount = 0;
  
  const isSubsetSumRec = (arr, n, sum, depth = 0, path = []) => {
    callCount++;
    const currentCall = {
      id: callCount,
      n,
      sum,
      depth,
      path: [...path],
      delay: callCount * 100,
      result: null
    };
    
    if (sum === 0) {
      currentCall.result = true;
      currentCall.isBaseCase = true;
      currentCall.baseReason = "sum === 0 (found solution)";
      calls.push(currentCall);
      return true;
    }
    if (n === 0) {
      currentCall.result = false;
      currentCall.isBaseCase = true;
      currentCall.baseReason = "n === 0 (no more elements)";
      calls.push(currentCall);
      return false;
    }
    
    if (arr[n - 1] > sum) {
      currentCall.action = `Skip ${arr[n - 1]} (> ${sum})`;
      calls.push(currentCall);
      const result = isSubsetSumRec(arr, n - 1, sum, depth + 1, path);
      currentCall.result = result;
      return result;
    }
    
    currentCall.action = `Try include/exclude ${arr[n - 1]}`;
    calls.push(currentCall);
    
    const exclude = isSubsetSumRec(arr, n - 1, sum, depth + 1, path);
    const include = isSubsetSumRec(arr, n - 1, sum - arr[n - 1], depth + 1, [...path, arr[n - 1]]);
    
    const result = exclude || include;
    currentCall.result = result;
    currentCall.includeResult = include;
    currentCall.excludeResult = exclude;
    
    return result;
  };
  
  const result = isSubsetSumRec(arr, arr.length, target);
  return { result, calls };
};

const isSubsetSumMeetMiddle = (arr, target) => {
  const n = arr.length;
  const mid = Math.floor(n / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  const getSumsWithSubsets = (subset) => {
    const result = [];
    const total = 1 << subset.length;
    for (let i = 0; i < total; i++) {
      let sum = 0;
      const sub = [];
      for (let j = 0; j < subset.length; j++) {
        if (i & (1 << j)) {
          sum += subset[j];
          sub.push(subset[j]);
        }
      }
      result.push({ sum, subset: sub });
    }
    return result;
  };

  const leftSums = getSumsWithSubsets(left);
  const rightSums = getSumsWithSubsets(right);

  const rightMap = new Map();
  rightSums.forEach(({ sum, subset }) => {
    if (!rightMap.has(sum)) rightMap.set(sum, []);
    rightMap.get(sum).push(subset);
  });

  const all = Array.from(new Set([...leftSums.map(r => r.sum), ...rightSums.map(r => r.sum)]));

  let found = false;
  let subsetUsed = [];
  for (const { sum, subset } of leftSums) {
    if (rightMap.has(target - sum)) {
      found = true;
      subsetUsed = [...subset, ...rightMap.get(target - sum)[0]];
      break;
    }
  }

  return { found, all, subsetUsed, left, right, leftSums, rightSums };
};

const Algoritmo2 = () => {
  const [input, setInput] = useState('3,4,5,6');
  const [target, setTarget] = useState(9);
  const [modo, setModo] = useState('comunidad');
  const [recursionCalls, setRecursionCalls] = useState([]);
  const [aproxValues, setAproxValues] = useState([]);
  const [leftPart, setLeftPart] = useState([]);
  const [rightPart, setRightPart] = useState([]);
  const [leftSums, setLeftSums] = useState([]);
  const [rightSums, setRightSums] = useState([]);
  const [result, setResult] = useState(null);
  const [subconjunto, setSubconjunto] = useState([]);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [currentExplanation, setCurrentExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  // ESTA ES LA CLAVE - Limpiar la clase fade-out cuando el componente se monta
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      // Remover la clase fade-out inmediatamente
      body.classList.remove('fade-out');
      // Permitir scroll en esta página específica
      body.style.overflow = 'auto';
    }

    // Cleanup cuando el componente se desmonte
    return () => {
      if (body) {
        body.style.overflow = 'hidden'; // Restaurar para el menú
      }
    };
  }, []);

  const explanations = [
    "Paso 1: Dividiendo el conjunto en dos partes...",
    "Paso 2: Calculando todas las sumas posibles para la parte izquierda...",
    "Paso 3: Calculando todas las sumas posibles para la parte derecha...",
    "Paso 4: Buscando combinaciones que sumen el objetivo...",
    "Paso 5: ¡Resultado encontrado!"
  ];

  useEffect(() => {
    if (modo === 'propio' && running) {
      const timer = setInterval(() => {
        setStep(prev => {
          if (prev >= maxSteps) {
            clearInterval(timer);
            setRunning(false);
            return prev;
          }
          setCurrentExplanation(explanations[Math.min(prev, explanations.length - 1)]);
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [running, maxSteps, modo]);

  const ejecutarAlgoritmo = () => {
    const arr = input.split(',').map(Number).filter(n => !isNaN(n) && n >= 1 && n <= 50);
    if (arr.length > 10 || target < 1 || target > 100) {
      alert("Máx 10 números entre 1-50 y objetivo entre 1-100 (recursión es exponencial).");
      return;
    }
    
    setRunning(true);
    setStep(0);
    
    setTimeout(() => {
      if (modo === 'comunidad') {
        const { result, calls } = isSubsetSumRecursive(arr, target);
        setRecursionCalls(calls);
        setResult(result);
        setAproxValues([]);
        setSubconjunto([]);
        setLeftPart([]);
        setRightPart([]);
        setLeftSums([]);
        setRightSums([]);
        setRunning(false);
      } else {
        setMaxSteps(5);
        const { found, all, subsetUsed, left, right, leftSums, rightSums } = isSubsetSumMeetMiddle(arr, target);
        setLeftSums(leftSums);
        setRightSums(rightSums);
        setResult(found);
        setAproxValues(all);
        setSubconjunto(subsetUsed);
        setLeftPart(left);
        setRightPart(right);
        setRecursionCalls([]);
      }
    }, 300);
  };

  return (
    <div 
      className="min-h-screen bg-fixed bg-center bg-cover text-white flex flex-col items-center p-8 font-arcade"
      style={{ 
        backgroundImage: "url('/images/FuegoAnimado.gif')",
        overflowY: 'auto',
        minHeight: '100vh'
      }}
    >
      <div className="w-full max-w-6xl space-y-8">
        <h1 className="text-4xl font-extrabold text-center drop-shadow-xl tracking-wider animate-pulse text-white">
          🎮 Subset Sum Visualizer
        </h1>
        
        <div className="text-center text-lg bg-black/30 p-4 rounded-lg">
          <p><strong>Comunidad (GeeksforGeeks):</strong> Recursión O(2^n) - Muy lento</p>
          <p><strong>Propio (Divide y Vencerás):</strong> Meet in the Middle O(2^(n/2)) - Más eficiente</p>
        </div>

        <ControlesSubset
          input={input}
          setInput={setInput}
          target={target}
          setTarget={setTarget}
          modo={modo}
          setModo={setModo}
          ejecutarAlgoritmo={ejecutarAlgoritmo}
          running={running}
          showExplanation={showExplanation}
          setShowExplanation={setShowExplanation}
        />

        <ResultadoSubset
          result={result}
          subconjunto={subconjunto}
          showExplanation={showExplanation}
          currentExplanation={currentExplanation}
          step={step}
          running={running}
          leftPart={leftPart}
          rightPart={rightPart}
          leftSums={leftSums}
          rightSums={rightSums}
          aproxValues={aproxValues}
          target={target}
          modo={modo}
          recursionCalls={recursionCalls}
        />

        {modo === 'comunidad' && recursionCalls.length > 0 && (
          <TablaRecursion
            recursionCalls={recursionCalls}
            input={input}
            target={target}
          />
        )}
      </div>
    </div>
  );
};

export default Algoritmo2;