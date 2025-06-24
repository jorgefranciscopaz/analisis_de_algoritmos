// TablaRecursion.tsx
import React from 'react';
import { DPCell } from './CeldaSubset';

const TablaRecursion = ({ table, delayMap, input }) => {
  if (table.length === 0) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="overflow-x-auto bg-black/20 p-6 rounded-xl border-2 border-blue-400 shadow-xl">
        <div className="flex flex-col items-center">
          {/* First row - column headers */}
          <div className="flex">
            <div className="w-12 h-12 flex items-center justify-center border border-white bg-blue-600 text-white font-bold text-lg">
              ∅
            </div>
            {Array.from({ length: table[0].length }).map((_, j) => (
              <div 
                key={`header-${j}`} 
                className="w-12 h-12 flex items-center justify-center border border-white bg-blue-600 text-white font-bold text-lg"
              >
                {j}
              </div>
            ))}
          </div>

          {/* Subsequent rows */}
          {table.map((row, i) => (
            <div key={`row-${i}`} className="flex">
              {/* Row header */}
              <div 
                key={`row-header-${i}`} 
                className="w-12 h-12 flex items-center justify-center border border-white bg-blue-600 text-white font-bold text-lg"
              >
                {i === 0 ? '∅' : input.split(',')[i - 1]}
              </div>

              {/* Row cells */}
              {row.map((cell, j) => (
                <DPCell 
                  key={`${i}-${j}`} 
                  value={cell} 
                  delay={delayMap[i]?.[j] || 0}
                  isHeader={false}
                  isFirstColumn={false}
                />
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-300 text-center">
          <p>✔️ = Subconjunto existe | ❌ = No existe</p>
          <p>Fila = Elementos usados | Columna = Suma objetivo</p>
        </div>
      </div>
    </div>
  );
};

export default TablaRecursion;