// Frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";

import Home from "./components/home";

import ReglaFalsa from "./components/methods/reglafalsa/ReglaFalsa";
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

import LU from "./pages/cap2/LU.jsx";
import LUPivoteo from "./pages/cap2/LUPivoteo.jsx";
import Crout from "./pages/cap2/Crout.jsx";
import Doolittle from "./pages/cap2/Doolittle.jsx";
import Cholesky from "./pages/cap2/Cholesky.jsx";

import Capitulo1 from "./components/chapters/Capitulo1";
import Capitulo2 from "./components/chapters/Capitulo2";
import Capitulo3 from "./components/chapters/Capitulo3";
import Capitulo4 from "./components/chapters/Capitulo4";

import VandermondePage from "./components/methods/cap3/vandermonde/Vandermonde";
import NewtonInterpolantePage from "./components/methods/cap3/newton/NewtonInterpolante";
import LagrangePage from "./components/methods/cap3/lagrange/Lagrange";
import SplinesPage from "./components/methods/cap3/splines/Splines";
import InformeCap3 from "./components/ComparativeInterpolationReportGenerator";

import ComparativeCap4Report from "./pages/cap4/ComparativeCap4Report";

function App() {
  return (
    <div className="w-full">
      <Routes>
        {/* Home y capítulos */}
        <Route path="/" element={<Home />} />
        <Route path="/capitulo-1" element={<Capitulo1 />} />
        <Route path="/capitulo-2" element={<Capitulo2 />} />
        <Route path="/capitulo-3" element={<Capitulo3 />} />
        <Route path="/capitulo-4" element={<Capitulo4 />} />

        {/* Capítulo 1: raíces */}
        <Route path="/metodos/biseccion" element={<Biseccion />} />
        <Route path="/metodos/regla-falsa" element={<ReglaFalsa />} />
        <Route path="/metodos/secante" element={<Secante />} />
        <Route path="/metodos/punto-fijo" element={<Puntofijo />} />
        <Route path="/metodos/raices-multiples" element={<RaicesMultiples />} />
        <Route path="/metodos/newton" element={<Newton />} />
        <Route path="/graficador" element={<Graficador />} />
        <Route path="/informe" element={<Informe />} />

        {/* Capítulo 2: métodos iterativos de matrices */}
        <Route path="/metodos/cap2/jacobi" element={<Jacobi />} />
        <Route path="/metodos/cap2/gauss-seidel" element={<GaussSeidel />} />
        <Route path="/metodos/cap2/sor" element={<Sor />} />
        <Route path="/informeMatrix" element={<InformeMatrix />} />

        {/* Capítulo 2/4: métodos directos (LU, Crout, etc.) */}
        <Route path="/metodos/cap2/lu-simple" element={<LU />} />
        <Route path="/metodos/cap2/lu-pivoteo" element={<LUPivoteo />} />
        <Route path="/metodos/cap2/crout" element={<Crout />} />
        <Route path="/metodos/cap2/doolittle" element={<Doolittle />} />
        <Route path="/metodos/cap2/cholesky" element={<Cholesky />} />

        {/* Capítulo 3: interpolación */}
        <Route path="/metodos/vander" element={<VandermondePage />} />
        <Route
          path="/metodos/newton-interpolante"
          element={<NewtonInterpolantePage />}
        />
        <Route path="/metodos/lagrange" element={<LagrangePage />} />
        <Route path="/metodos/splines" element={<SplinesPage />} />
        <Route path="/informeCap3" element={<InformeCap3 />} />

        {/* Capítulo 4: informe comparativo métodos directos */}
        <Route path="/informeCap4" element={<ComparativeCap4Report />} />
      </Routes>
    </div>
  );
}

export default App;
