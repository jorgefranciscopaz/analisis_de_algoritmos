type props = {
  onClick: () => void;
  texto: string
}

const Boton = ({onClick, texto}: props) => {
  return (
    <button className="cursor-pointer  text-white border-4 border-black rounded-4xl text-3xl font-bold" onClick={onClick}>
      <div className="rounded-4xl px-6 py-2 text-2xl font-bold bg-linear-to-b from-green-700 to-green-500 border-4 border-green-500">
        {texto}
      </div>
    </button>
  )
}

export default Boton;