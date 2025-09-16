// Frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ReglaFalsa  from "./components/methods/reglafalsa/ReglaFalsa";
import Graficador from "./components/methods/graficador";
import Secante from "./components/methods/secante/secante";
import RaicesMultiples from "./components/methods/raicesmultiples/raicesmultiples";
import Biseccion from "./components/methods/biseccion/biseccion";
import Puntofijo from "./components/methods/puntofijo/puntofijo";
import Newton from "./components/methods/newton/newton";
import Informe from "./components/ComparativeReportGenerator";
import Jacobi from "./components/methods/cap2/jacobi/jacobi";
import GaussSeidel from "./components/methods/cap2/gaussseidel/gaussseidel";
import Sor from "./components/methods/cap2/sor/sor";
import InformeMatrix from "./components/ComparativeMatrixReportGenerator";
import Capitulo1 from "./components/chapters/Capitulo1";

import Capitulo2 from "./components/chapters/Capitulo2";
import Capitulo3 from "./components/chapters/Capitulo3";

function App() {
  return (
    <div className="w-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capitulo-1" element={<Capitulo1 />} />
        <Route path="/capitulo-2" element={<Capitulo2 />} />
        <Route path="/capitulo-3" element={<Capitulo3 />} />
        <Route path="/metodos/biseccion" element={<Biseccion />} />
        <Route path="/metodos/regla-falsa" element={<ReglaFalsa />} />
        <Route path="/metodos/secante" element={<Secante />} />
        <Route path="/metodos/punto-fijo" element={<Puntofijo />} />
        <Route path="/metodos/newton" element={<Newton />} />
        <Route path="/graficador" element={<Graficador />} />
        <Route path="/informe" element={<Informe />} />
        <Route path="/informeMatrix" element={<InformeMatrix />} />
        <Route path="/metodos/cap2/jacobi" element={<Jacobi />} />
        <Route path="/metodos/cap2/gauss-seidel" element={<GaussSeidel />} />
        <Route path="/metodos/cap2/sor" element={<Sor />} />
      </Routes>
    </div>
  );
}

export default App;
