import { useEffect, useRef, useState } from "react";

type Node = [number, number];

type Mode = "add" | "remove";

const algoritmo1 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [mode, setMode] = useState<Mode>("add");

  useEffect(() => {
    document.body.classList.add("fade-in");
    return () => {
      document.body.classList.remove("fade-in");
    };
  }, []);

  useEffect(() => {
    draw();
  }, [nodes]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "add") {
      setNodes((prev) => [...prev, [x, y]]);
    } else if (mode === "remove") {
      setNodes((prev) =>
        prev.filter(([nx, ny]) => Math.hypot(nx - x, ny - y) > 10)
      );
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw nodes
    ctx.fillStyle = "black";
    nodes.forEach(([x, y], i) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(i.toString(), x + 8, y);
    });
  };

  const calculateBruteForcePath = () => {
    if (nodes.length < 2) return;

    const permutations = (arr: Node[]): Node[][] => {
      if (arr.length === 1) return [arr];
      const result: Node[][] = [];
      for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        for (const perm of permutations(rest)) {
          result.push([arr[i], ...perm]);
        }
      }
      return result;
    };

    const distance = (a: Node, b: Node): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

    let bestPath = nodes;
    let minDist = Infinity;
    for (const perm of permutations(nodes)) {
      const pathDist = perm.reduce((acc, curr, i, arr) =>
        acc + (i < arr.length - 1 ? distance(curr, arr[i + 1]) : distance(arr[arr.length - 1], arr[0])), 0);
      if (pathDist < minDist) {
        minDist = pathDist;
        bestPath = perm;
      }
    }

    // Draw path
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bestPath[0][0], bestPath[0][1]);
    bestPath.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(bestPath[0][0], bestPath[0][1]);
    ctx.stroke();
  };

  const clearCanvas = () => {
    setNodes([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Algoritmo Fuerza Bruta - TSP</h1>
      <p className="text-gray-700 text-center max-w-2xl mb-4">
        Toda esta área será un mapa interactivo. Al hacer clic, se colocará un nodo. Si se selecciona "Eliminar NODO",
        se podrá hacer clic sobre un nodo para eliminarlo.
      </p>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border border-gray-400 mb-4 bg-white"
        onClick={handleCanvasClick}
      />
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => setMode("add")}
          className="px-4 py-2 border rounded hover:bg-green-200"
        >
          Agregar NODO
        </button>
        <button
          onClick={() => setMode("remove")}
          className="px-4 py-2 border rounded hover:bg-red-200"
        >
          Eliminar NODO
        </button>
        <button
          onClick={calculateBruteForcePath}
          className="px-4 py-2 border rounded hover:bg-blue-200"
        >
          Calcular ruta
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 border rounded hover:bg-gray-300"
        >
          Limpiar Canvas
        </button>
      </div>
    </div>
  );
};

export default algoritmo1;
