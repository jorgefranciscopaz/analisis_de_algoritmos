import { useEffect, useState } from "react";
import Boton from "../components/knapsack/Boton";
import characters from "../../json//characters.json"

type applicant = {
  name: string;
  salary: number;
  rating: number;
}

const algoritmo1 = () => {
  useEffect(() => {
    document.body.classList.add("fade-in");
    return () => {
      document.body.classList.remove("fade-in");
    };
  }, []);

  const [stage, setStage] = useState("start");  
  const [budget, setBudget] = useState(0);
  const [resumes, setResumes] = useState(0);
  const maxSalary: number = 85000;
  const minSalary: number = 25000;
  const [applicants, setApplicants] = useState<applicant[]>([]);

  const resumeCard = (applicant: applicant) => {
    return (
      <section className="relative overflow-hidden rounded-2xl drop-shadow-sm">
        <img src="./images/Knapsackeria/CardBg.png" className="w-full"/>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="./images/Knapsackeria/Papa_Louie.png" className="w-3/5 max-w-sm"/>
        </div>
        <div className="absolute bottom-8 left-[-8%] w-[116%] transform -rotate-12">
          <h4 className="bg-teal-600 text-white font-bold text-2xl border-t-4 border-b-4 text-center border-gray-400">{applicant.name}</h4>
          <h5 className="bg-gray-200 text-teal-600 font-semibold text-lg px-4 border-b-4 border-l-4 rounded-bl-2xl ml-12 border-gray-400">${applicant.salary} | ⭐{applicant.rating}</h5>
        </div>
      </section>
    )
  }

  const generateApplicants = () => {
    const newApplicants = [];
    for (let i = 0; i < resumes; i++) {
      newApplicants.push({
        name: characters.characters[i % characters.characters.length].name,
        salary: Math.floor(Math.random() * (maxSalary - minSalary + 1) + minSalary),
        rating: Math.floor(Math.random() * 100) + 1
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
              <h4 className="text-3xl text-cyan-800 font-bold text-center">Entrevistando...</h4>
            </section>
          )}

          {stage === "applicants" && (
            <div className="w-full h-full flex flex-col">
              <h4 className="text-3xl text-cyan-800 font-bold text-center mb-4">Aplicantes</h4>
              <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-2 flex-1">
                {applicants.map((applicant, index) => (
                  <div key={index} className=" ">
                    {resumeCard(applicant)}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Boton texto="EVALUAR" onClick={() => setStage("applicants")} />
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
