import { useEffect, useState } from "react";
import Boton from "../components/knapsack/Boton";
import characters from "../../json//characters.json"

const algoritmo1 = () => {
  useEffect(() => {
    document.body.classList.add("fade-in");
    return () => {
      document.body.classList.remove("fade-in");
    };
  }, []);

  const [stage, setStage] = useState("applying");  
  const [budget, setBudget] = useState(0);
  const [resumes, setResumes] = useState(0);

  const resumeCard = () => {
    return (
      <section className="flex">
        <img src="./images/Knapsackeria/Papa_Louie.png" className="w-1/2 max-w-sm"/>
        <div>
          <h2 className="text-xl text-cyan-800 font-bold text-center">Name: {characters.characters[0].name}</h2>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-[url('./images/Knapsackeria/Wallpaper.png')] w-screen h-screen font-baloo2 overflow-hidden">
      <div className="flex w-full h-full">
        <div className="w-1/2 flex items-center justify-center">
          <img src="./images/Knapsackeria/Papa_Louie.png" className="-scale-x-100 scale-y-100 w-3/4 max-w-sm" />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          {stage === "start" && (
            <section className="flex flex-col items-center gap-8">
              <img src="./images/Knapsackeria/Logo.png" className="w-3/4 max-w-md" />
              <Boton texto="COMENZAR" onClick={() => setStage("budget")} />
            </section>
          )}

      {["budget", "resumes", "applying", "applicants"].includes(stage) && (
        /* w-[30rem] h-[24rem] */
        <section className="bg-gray-50 rounded-xl drop-shadow-xl w-[40rem] h-[50rem] p-6 flex flex-col items-center justify-between gap-4">

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
                    onChange={(e) => setResumes(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button className="text-2xl font-semibold bg-gray-100 rounded-xl border-2 border-gray-400 text-gray-400 h-10 w-10">▲</button>
                  <button className="text-2xl font-semibold bg-gray-100 rounded-xl border-2 border-gray-400 text-gray-400 h-10 w-10">▼</button>
                </div>
              </div>
              <Boton texto="CONFIRMAR" onClick={() => setStage("applying")} />
            </>
          )}

          {stage === "applying" && (
            <section className="flex items-center justify-center h-96">
              {resumeCard()}
            </section>
          )}


          {stage === "applicants" && (
            <>
              <h4 className="text-3xl text-cyan-800 font-bold text-center">Aplicantes</h4>
              {/* Resume cards go here */}
            </>
          )}
        </section>
      )}
    </div>
  </div>
</div>
  );
};

export default algoritmo1;
