type Props = {
  onClick: () => void;
  texto: string;
  disabled?: boolean;
}

const Boton = ({ onClick, texto, disabled = false }: Props) => {
  return (
    <button 
      className={`text-white border-4 border-black rounded-4xl text-3xl font-bold ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
      onClick={onClick}
      disabled={disabled}
    >
      <div className={`rounded-4xl px-6 py-2 text-2xl font-bold ${disabled ? 'bg-gray-500' : 'bg-gradient-to-b from-green-700 to-green-500 hover:from-green-600 hover:to-green-400'} border-4 border-green-500`}>
        {texto}
      </div>
    </button>
  )
}

export default Boton;