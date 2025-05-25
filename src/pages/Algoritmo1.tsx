import type { FC } from "react";
import { useEffect } from "react";

const algoritmo1: FC = () => {
  useEffect(() => {
    document.body.classList.add("fade-in");
    return () => {
      document.body.classList.remove("fade-in");
    };
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Algoritmo 1</h1>
      <p className="text-gray-700">ALGORITMO NO POLINOMICO NUMERO #1</p>
    </div>
  );
};

export default algoritmo1;
