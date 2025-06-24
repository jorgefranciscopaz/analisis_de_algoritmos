import type { FC } from "react";
import { useEffect } from "react";
import MenuInicio from './components/menuInicio';

const App: FC = () => {
  useEffect(() => {
    document.body.classList.add('fade-in');
    return () => {
      document.body.classList.remove('fade-in');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <MenuInicio />
    </div>
  );
};

export default App;