import { useEffect, useRef } from "react";

const algoritmo1 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    document.body.classList.add("fade-in");
    return () => {
      document.body.classList.remove("fade-in");
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuración
    const width = canvas.width = 800;
    const height = canvas.height = 600;
    const cityCount = 10;
    const cities = Array.from({ length: cityCount }, () => [
      Math.random() * width,
      Math.random() * height,
    ]);

    const distance = (a, b) => {
      return Math.hypot(a[0] - b[0], a[1] - b[1]);
    };

    const nearestNeighbor = (points) => {
      const visited = new Set();
      const path = [0];
      visited.add(0);
      while (path.length < points.length) {
        const last = path[path.length - 1];
        let nearest = -1;
        let minDist = Infinity;
        for (let i = 0; i < points.length; i++) {
          if (!visited.has(i)) {
            const d = distance(points[last], points[i]);
            if (d < minDist) {
              minDist = d;
              nearest = i;
            }
          }
        }
        visited.add(nearest);
        path.push(nearest);
      }
      return [...path, 0]; // vuelta al inicio
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Dibujar ciudades
      ctx.fillStyle = "black";
      cities.forEach(([x, y], i) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(i.toString(), x + 8, y);
      });

      // Dibujar ruta
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      const path = nearestNeighbor(cities);
      ctx.beginPath();
      ctx.moveTo(cities[path[0]][0], cities[path[0]][1]);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(cities[path[i]][0], cities[path[i]][1]);
      }
      ctx.stroke();
    };

    draw();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Algoritmo TSP - Vecino Más Cercano</h1>
      <p className="text-gray-700 mb-6">
        Visualización interactiva del algoritmo del viajante de comercio utilizando el método del vecino más cercano.
      </p>
      <div className="overflow-auto border border-gray-300 shadow rounded-lg">
        <canvas ref={canvasRef} className="block mx-auto bg-white" />
      </div>
    </div>
  );
};

export default algoritmo1;
