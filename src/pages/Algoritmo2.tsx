// Algoritmo2.tsx
import React, { useState, useEffect } from 'react';
import ControlesSubset from './ControlesSubset';
import ResultadoSubset from './ResultadoSubset';
import TablaRecursion from './TablaRecursion';
import '../game-style.css';

// Algoritmo de programación dinámica
const buildDPTable = (arr, target) => {
  const n = arr.length;
  const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
  const delayArr = Array.from({ length: n + 1 }, () => Array(target + 1).fill(0));
  let delayCounter = 0;

  for (let i = 0; i <= n; i++) dp[i][0] = true;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= target; j++) {
      if (arr[i - 1] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - arr[i - 1]];
      }
      delayArr[i][j] = ++delayCounter * 50;
    }
  }
  return { dp, delayArr, result: dp[n][target] };
};

// Algoritmo Meet in the Middle
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
  // Estados principales
  const [input, setInput] = useState('3,4,5,6');
  const [target, setTarget] = useState(9);
  const [modo, setModo] = useState('comunidad');
  
  // Estados para programación dinámica
  const [table, setTable] = useState([]);
  const [delayMap, setDelayMap] = useState([]);
  
  // Estados para meet in the middle
  const [aproxValues, setAproxValues] = useState([]);
  const [leftPart, setLeftPart] = useState([]);
  const [rightPart, setRightPart] = useState([]);
  const [leftSums, setLeftSums] = useState([]);
  const [rightSums, setRightSums] = useState([]);
  
  // Estados generales
  const [result, setResult] = useState(null);
  const [subconjunto, setSubconjunto] = useState([]);
  const [running, setRunning] = useState(false);
  
  // Estados para animación de pasos
  const [step, setStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [currentExplanation, setCurrentExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  const explanations = [
    "Paso 1: Dividiendo el conjunto en dos partes...",
    "Paso 2: Calculando todas las sumas posibles para la parte izquierda...",
    "Paso 3: Calculando todas las sumas posibles para la parte derecha...",
    "Paso 4: Buscando combinaciones que sumen el objetivo...",
    "Paso 5: ¡Resultado encontrado!"
  ];

  // Efecto para controlar la animación paso a paso
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
    if (arr.length > 20 || target < 1 || target > 100) {
      alert("Máx 20 números entre 1-50 y objetivo entre 1-100.");
      return;
    }
    
    setRunning(true);
    setStep(0);
    
    setTimeout(() => {
      if (modo === 'comunidad') {
        const { dp, delayArr, result } = buildDPTable(arr, target);
        setTable(dp);
        setDelayMap(delayArr);
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
        setTable([]);
        setDelayMap([]);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-fixed bg-center bg-cover bg-[url('/images/FuegoAnimado.gif')] text-white flex flex-col items-center p-8 font-arcade overflow-y-auto">
      <div className="w-full max-w-6xl space-y-8">
        <h1 className="text-4xl font-extrabold text-center drop-shadow-xl tracking-wider animate-pulse text-white">
          🎮 Subset Sum Visualizer
        </h1>

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
        />

        {modo === 'comunidad' && table.length > 0 && (
          <TablaRecursion
            table={table}
            delayMap={delayMap}
            input={input}
          />
        )}
      </div>
    </div>
  );
};

export default Algoritmo2;
