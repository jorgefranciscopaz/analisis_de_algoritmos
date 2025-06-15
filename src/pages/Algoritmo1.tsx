import { useEffect, useRef, useState } from "react";
import "../styles/algoritmo1.css";

type Node = [number, number];

type Mode = "add" | "remove";

const algoritmo1 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [mode, setMode] = useState<Mode>("add");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clickEffects, setClickEffects] = useState<{
    x: number;
    y: number;
    radius: number;
    opacity: number;
  }[]>([]);

  useEffect(() => {
    document.body.classList.add("fade-in");
    return () => {
      document.body.classList.remove("fade-in");
    };
  }, []);

  useEffect(() => {
    draw();
  }, [nodes, clickEffects]);

  useEffect(() => {
    if (clickEffects.length === 0) return;

    const interval = setInterval(() => {
      setClickEffects((prev) =>
        prev
          .map((e) => ({ ...e, radius: e.radius + 2, opacity: e.opacity - 0.05 }))
          .filter((e) => e.opacity > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, [clickEffects]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "add") {
      setNodes((prev) => [...prev, [x, y]]);
      setClickEffects((prev) => [...prev, { x, y, radius: 0, opacity: 1 }]);
    } else if (mode === "remove") {
      setNodes((prev) =>
        prev.filter(([nx, ny]) => Math.hypot(nx - x, ny - y) > 10)
      );
    }
  };

  const getColor = (index: number): string => {
    const colors = ["#ff6f61", "#6b5b95", "#88b04b", "#f7cac9", "#92a8d1", "#955251", "#b565a7"];
    return colors[index % colors.length];
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = "/images/pixel_nodo.png";

    img.onload = () => {
      nodes.forEach(([x, y], i) => {
        const size = 32;
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);

        ctx.font = "bold 16px 'Press Start 2P', cursive";
        ctx.fillStyle = getColor(i);
        ctx.fillText(i.toString(), x + size / 2 + 6, y + 6);
      });

      clickEffects.forEach((effect) => {
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${effect.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };
  };

  const calculateBruteForcePath = async () => {
    if (nodes.length < 2) return;
    setLoading(true);
    setProgress(0);

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

    const distance = (a: Node, b: Node): number =>
      Math.hypot(a[0] - b[0], a[1] - b[1]);

    let bestPath = nodes;
    let minDist = Infinity;
    const perms = permutations(nodes);
    for (let i = 0; i < perms.length; i++) {
      const perm = perms[i];
      const pathDist = perm.reduce(
        (acc, curr, i, arr) =>
          acc +
          (i < arr.length - 1
            ? distance(curr, arr[i + 1])
            : distance(arr[arr.length - 1], arr[0])),
        0
      );
      if (pathDist < minDist) {
        minDist = pathDist;
        bestPath = perm;
      }
      if (i % 500 === 0) {
        setProgress(Math.round(((i + 1) / perms.length) * 100));
        await new Promise((res) => setTimeout(res, 1));
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw();
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bestPath[0][0], bestPath[0][1]);
    bestPath.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(bestPath[0][0], bestPath[0][1]);
    ctx.stroke();

    setLoading(false);
  };

  const clearCanvas = () => {
    setNodes([]);
    setProgress(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="algoritmo-container">
      <h1 className="algoritmo-title">Algoritmo TSP</h1>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="canvas-box"
          onClick={handleCanvasClick}
        />
      </div>

      {loading && (
        <div className="progress-wrapper">
          <div
            className="progress-bar retro-flash"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="progress-label">Calculando ruta: {progress}%</p>
        </div>
      )}

      <div className="button-group">
        <button onClick={() => setMode("add")} className="boton">
          Agregar nodo
        </button>
        <button onClick={() => setMode("remove")} className="boton">
          Eliminar Nodo
        </button>
        <button onClick={calculateBruteForcePath} className="boton">
          Calcular ruta
        </button>
        <button onClick={clearCanvas} className="boton">
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default algoritmo1;
