import { useEffect, useState } from "react";
import Boton from "../components/knapsack/Boton";
import characters from "../../json//characters.json"

type applicant = {
  name: string;
  img: string;
  salary: number;
  rating: number;
  ratio: number;
}

/* ---Knapsack Greedy--- */
function knapsackGreedy(W: number, applicants: applicant[]){
  for (let i = 0; i < applicants.length; i++) {
    applicants[i].ratio = applicants[i].rating / applicants[i].salary;
  }

  applicants.sort((a, b) => b.ratio - a.ratio);

  let maxRating = 0;
  let selectedApplicants: applicant[] = [];

  for (let i = 0; i < applicants.length; i++) {
    if (applicants[i].salary <= W) {
      maxRating += applicants[i].rating;
      selectedApplicants.push(applicants[i]);
      W -= applicants[i].salary;
    }
  }

  return { maxRating, selectedApplicants };
}


/* ---Knapsack Naive--- */
function knapsackRec(W: number, applicants: applicant[], n: number): number {
  if (n === 0 || W === 0)
      return 0;
  let pick = 0;
  if (applicants[n - 1].salary <= W)
      pick = applicants[n - 1].rating + knapsackRec(W - applicants[n - 1].salary, applicants, n - 1);
  let notPick = knapsackRec(W, applicants, n - 1);
  return Math.max(pick, notPick);
}

function knapsackCommunity(W: number, applicants: applicant[]) {
  let n = applicants.length;
  return knapsackRec(W, applicants, n);
}

/* ---Knapsack Memoized--- */
function knapsackMemoRec(W: number, applicants: applicant[], n: number, memo: number[][]) {
  if (n === 0 || W === 0)
      return 0;

  if (memo[n][W] !== -1)
      return memo[n][W];

  let pick = 0;
  if (applicants[n - 1].salary <= W)
      pick = applicants[n - 1].rating + knapsackMemoRec(W - applicants[n - 1].salary, applicants, n - 1, memo);

  let notPick = knapsackMemoRec(W, applicants, n - 1, memo);

  memo[n][W] = Math.max(pick, notPick);
  return memo[n][W];
}

function knapsackMemo(W: number, applicants: applicant[]) {
  const n = applicants.length;
  const memo = Array.from({ length: n + 1 }, () => Array(W + 1).fill(-1));
  return knapsackMemoRec(W, applicants, n, memo);
}



/* ---Implementacion Visual--- */
const algoritmo1 = () => {
  useEffect(() => {
    document.body.classList.add('fade-in');
    return () => {
      document.body.classList.remove('fade-in');
    };
  }, []);

  const [stage, setStage] = useState("start");  
  const [budget, setBudget] = useState(0);
  const [resumes, setResumes] = useState(0);
  const maxSalary: number = 85000;
  const minSalary: number = 25000;
  const [applicants, setApplicants] = useState<applicant[]>([]);
  
  /* --- Results --- */
  const [isRunning, setIsRunning] = useState({
    greedy: false,
    memoized: false,
    naive: false
  });
  const [greedyRuntime, setGreedyRuntime] = useState<number | null>(null);
  const [memoizedRuntime, setMemoizedRuntime] = useState<number | null>(null);
  const [naiveRuntime, setNaiveRuntime] = useState<number | null>(null);
  const [greedyRating, setGreedyRating] = useState<number | null>(null);
  const [memoizedRating, setMemoizedRating] = useState<number | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<applicant[]>([]);
  
  const runAllAlgorithms = async () => {
    setGreedyRuntime(null);
    setMemoizedRuntime(null);
    setNaiveRuntime(null);
    setGreedyRating(null);
    setMemoizedRating(null);
    setSelectedApplicants([]);
    
    const runWithTime = async (
      algorithm: () => { maxRating: number, selectedApplicants?: applicant[] },
      type: 'greedy' | 'memoized' | 'naive'
    ) => {
      setIsRunning(prev => ({ ...prev, [type]: true }));
      const start = performance.now();
      
      try {
        const result = await new Promise<{ maxRating: number, selectedApplicants?: applicant[] }>((resolve) => {
          setTimeout(() => {
            resolve(algorithm());
          }, 0);
        });
        
        const end = performance.now();
        const runtime = end - start;
        
        if (type === 'greedy') {
          setGreedyRuntime(runtime);
          setGreedyRating(result.maxRating);
          if (result.selectedApplicants) {
            setSelectedApplicants(result.selectedApplicants);
          }
        } else if (type === 'memoized') {
          setMemoizedRuntime(runtime);
          setMemoizedRating(result.maxRating);
        } else {
          setNaiveRuntime(runtime);
        }
        
        return { type, runtime, success: true };
      } catch (error) {
        console.error(`${type} algorithm failed:`, error);
        return { type, runtime: 0, success: false };
      } finally {
        setIsRunning(prev => ({ ...prev, [type]: false }));
      }
    };
    
    const greedyPromise = runWithTime(() => knapsackGreedy(budget, [...applicants]), 'greedy');
    
    const memoizedPromise = runWithTime(() => ({
      maxRating: knapsackMemo(budget, [...applicants])
    }), 'memoized');
    
    let naivePromise;
    if (applicants.length <= 20) {
      naivePromise = runWithTime(() => ({
        maxRating: knapsackCommunity(budget, [...applicants])
      }), 'naive');
    } else {
      setIsRunning(prev => ({ ...prev, naive: false }));
      setNaiveRuntime(null);
      naivePromise = Promise.resolve({ type: 'naive', runtime: 0, success: false });
    }
    
    await Promise.allSettled([greedyPromise, memoizedPromise, naivePromise]);
    setStage("results");
  };

  const resumeCard = (applicant: applicant) => {
    return (
      <section className="relative overflow-hidden rounded-2xl drop-shadow-sm">
        <img src="./images/Knapsackeria/CardBg.png" className="w-full"/>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={applicant.img} className="h-4/5 max-h-sm"/>
        </div>
        <div className="absolute bottom-8 left-[-8%] w-[116%] transform -rotate-12">
          <h4 className="bg-teal-600 text-white font-bold text-2xl border-t-4 border-b-4 text-center border-gray-400">{applicant.name}</h4>
          <h5 className="bg-gray-200 text-teal-600 font-semibold text-lg px-4 border-b-4 border-l-4 rounded-bl-2xl ml-12 border-gray-400">${applicant.salary} | ⭐{applicant.rating}</h5>
        </div>
      </section>
    )
  }

  const premiumResumeCard = (applicant: applicant) => {
    return (
      <section className="relative overflow-hidden rounded-2xl drop-shadow-md drop-shadow-yellow-500">
        <img src="./images/Knapsackeria/CardBg.png" className="w-full -hue-rotate-[125deg]"/>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={applicant.img} className="h-4/5 max-h-sm"/>
        </div>
        <div className="absolute bottom-8 left-[-8%] w-[116%] transform -rotate-12">
          <h4 className="bg-yellow-600 text-white font-bold text-2xl border-t-4 border-b-4 text-center border-gray-400">{applicant.name}</h4>
          <h5 className="bg-gray-200 text-yellow-600 font-semibold text-lg px-4 border-b-4 border-l-4 rounded-bl-2xl ml-12 border-gray-400">${applicant.salary} | ⭐{applicant.rating}</h5>
        </div>
      </section>
    )
  }

  const generateApplicants = () => {
    const newApplicants = [];
    for (let i = 0; i < resumes; i++) {
      newApplicants.push({
        name: characters.characters[i % characters.characters.length].name,
        img: characters.characters[i % characters.characters.length].img,
        salary: Math.floor(Math.random() * (maxSalary - minSalary + 1) + minSalary),
        rating: Math.floor(Math.random() * 100) + 1,
        ratio: 0
      });
    }
    return newApplicants;
  };

  useEffect(() => {
    if (stage === "applying") {
      const newApplicants = generateApplicants();
      setApplicants(newApplicants);
      setStage("applicants");
    }
  }, [stage, resumes]);

  return (
    <div className="bg-[url('./images/Knapsackeria/Wallpaper.png')] w-screen h-screen font-baloo2 overflow-hidden">
      <div className="flex w-full h-full">
        <div className="w-1/2 flex items-center justify-center">
          <img src="./images/Knapsackeria/Papa_Louie.png" className="-scale-x-100 scale-y-100 w-3/4 max-w-sm" />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          
          {/* ---No Frame--- */}
          {stage === "start" && (
            <section className="flex flex-col items-center gap-8">
              <img src="./images/Knapsackeria/Logo.png" className="w-3/4" />
              <Boton texto="COMENZAR" onClick={() => setStage("budget")} />
            </section>
          )}

          {stage === "stats" && (
            <section className="w-full flex flex-col items-center gap-8">
              <h2 className="text-8xl text-white font-bold text-center">ESTADISTICAS</h2>
              <div className="w-full transform ml-12 rotate-4">
                <div className="flex items-center w-full">
                  <span className="bg-gray-100 text-black font-bold text-6xl px-4 py-2 border-4 border-r-0 border-black w-1/2">Greedy</span>
                  <span className="bg-gray-100 text-black font-bold text-6xl px-4 py-2 border-4 border-black w-1/2 text-center">
                    {greedyRuntime ? `${greedyRuntime.toFixed(2)} ms` : '...'}
                  </span>
                </div>
                <div className="flex items-center w-full">
                  <span className="ml-24 bg-cyan-600 text-white font-bold text-4xl px-4 py-2 border-4 border-t-0 border-r-0 border-black w-1/2">Memoizado</span>
                  <span className="bg-cyan-600 text-white font-bold text-4xl px-4 py-2 border-4 border-t-0 border-black w-1/2 text-center">
                    {memoizedRuntime ? `${memoizedRuntime.toFixed(2)} ms` : '...'}
                  </span>
                </div>
                <div className="flex items-center w-full">
                  <span className="ml-48 bg-purple-600 text-white font-bold text-2xl px-4 py-2 border-4 border-t-0 border-r-0 border-black w-1/2">Naive</span>
                  <span className="bg-purple-600 text-white font-bold text-2xl px-4 py-2 border-4 border-t-0 border-black w-1/2 text-center">
                    {naiveRuntime ? `${naiveRuntime.toFixed(2)} ms` : '...'}
                  </span>
                </div>
              </div>
              <Boton texto="REINICIAR" onClick={() => setStage("start")} />
            </section>
          )}
      
          {/* ---Small Frame--- */}
          {["budget", "resumes", "applying"].includes(stage) && (
              <section className="bg-gray-50 rounded-xl drop-shadow-xl w-[30rem] h-[24rem] p-6 flex flex-col items-center justify-between gap-4">
                {stage === "budget" && (
                  <>
                    <h2 className="text-4xl text-cyan-800 font-bold text-center">INGRESE EL PRESUPUESTO</h2>
                    <div className="flex items-center justify-center w-2/3 border-2 border-gray-400 bg-gray-100 rounded-xl px-4 py-2">
                      <label htmlFor="budget" className="text-2xl font-semibold mr-2">$</label>
                      <input
                        id="budget"
                        placeholder="0"
                        className="text-2xl font-semibold w-full bg-gray-100 outline-none"
                        onChange={(e) => setBudget(Number(e.target.value))}
                      />
                    </div>
                    <Boton texto="CONFIRMAR" onClick={() => setStage("resumes")} />
                  </>
                )}
                {stage === "resumes" && (
                  <>
                    <h2 className="text-3xl text-cyan-800 font-bold text-center">CANTIDAD DE ENTREVISTADOS</h2>
                    <div className="flex items-center justify-center gap-4">
                      <div className="bg-gray-100 rounded-xl border-2 border-gray-400 h-20 w-20 rotate-3">
                        <input
                          placeholder="0"
                          className="text-2xl font-semibold text-center w-20 h-20 outline-none -rotate-3"
                          value={resumes}
                          onChange={(e) => setResumes(Number(e.target.value))}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="text-2xl font-semibold bg-gray-100 rounded-xl border-2 border-gray-400 text-gray-400 h-10 w-10" onClick={() => setResumes(resumes + 1)}>▲</button>
                        <button className="text-2xl font-semibold bg-gray-100 rounded-xl border-2 border-gray-400 text-gray-400 h-10 w-10" onClick={() => setResumes(resumes - 1)}>▼</button>
                      </div>
                    </div>
                    <Boton texto="CONFIRMAR" onClick={() => setStage("applying")} />
                  </>
                )}
                {stage === "applying" && (
                  <section className="flex items-center justify-center h-96">
                    <h4 className="text-3xl text-cyan-800 font-bold text-center">ENTREVISTANDO...</h4>
                  </section>
                )}
              </section>
          )}

          {/* ---Big Frame--- */}
            {["applicants", "results"].includes(stage) && (
              <section className="bg-gray-50 rounded-xl drop-shadow-xl w-[40rem] h-[50rem] p-6 flex flex-col items-center justify-between gap-4">

                {stage === "applicants" && (
                  <div className="w-full h-full flex flex-col">
                    <h4 className="text-3xl text-cyan-800 font-bold text-center mb-4">APLICANTES</h4>
                    <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-2 flex-1">
                      {applicants.map((applicant, index) => (
                        <div key={index}>
                          {resumeCard(applicant)}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4">
                      <Boton 
                        texto="EVALUAR" 
                        onClick={runAllAlgorithms}
                        disabled={isRunning.greedy || isRunning.memoized || isRunning.naive}
                      />
                    </div>
                    {(isRunning.greedy || isRunning.memoized || isRunning.naive) && (
                      <div className="mt-4 text-center">
                        <p className="text-gray-600">Ejecutando algoritmos...</p>
                        <div className="flex justify-center gap-4 mt-2">
                          <span className={isRunning.greedy ? "text-blue-600" : "text-green-600"}>
                            Greedy {isRunning.greedy ? '🔄' : '✅'}
                          </span>
                          <span className={isRunning.memoized ? "text-blue-600" : "text-green-600"}>
                            Memoized {isRunning.memoized ? '🔄' : '✅'}
                          </span>
                          <span className={isRunning.naive ? "text-blue-600" : naiveRuntime === null ? "text-gray-400" : "text-green-600"}>
                            Naive {isRunning.naive ? '🔄' : naiveRuntime === null ? '⏭️' : '✅'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {stage === "results" && (
                  <div className="w-full h-full flex flex-col">
                    <h4 className="text-3xl text-cyan-800 font-bold text-center mb-4">CONTRATADOS</h4>
                    <p className="text-2xl text-yellow-600 mb-2 text-center font-semibold">⭐Máxima puntuación: {greedyRating}⭐</p>
                    <p className="text-lg text-yellow-600 mb-2 text-center font-semibold">⭐Máximo Hipotético: {memoizedRating}⭐</p>
                      <div className="grid grid-cols-3 gap-4 overflow-y-auto px-2 pb-4 flex-1">
                      {selectedApplicants.map((applicant, index) => (
                            <div key={index}>
                              {premiumResumeCard(applicant)}
                            </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4">
                      <Boton texto="CONTINUAR" onClick={() => setStage("stats")} />
                    </div>
                  </div>
                )}
              </section>
            )}
        </div>
      </div>
    </div>
  );
};

export default algoritmo1;
