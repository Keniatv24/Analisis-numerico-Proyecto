import { useState } from "react";
import { ArrowLeft, HelpCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import methodFormTemplate from "./methodForm.jsx";
import MethodResults from "./methodResults.jsx";
import api from "../../../../api/config";
import { useNavigate } from "react-router-dom";

const Jacobi = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    n: 4,
    matrixA: [
      [4, -1, 0, 3],
      [1, 15.5, 3, 8],
      [0, -1.3, -4, 1.1],
      [14, 5, -2, 30],
    ],
    vectorB: [1, 1, 1, 1],
    vectorX0: [0, 0, 0, 0],
    norm: "2",
    tol: "1e-7",
    maxIterations: 100,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // Cambia el tamaño de la matriz y ajusta los vectores
  const updateMatrixSize = (newN) => {
    if (newN < 2 || newN > 10) return;

    const newMatrixA = Array(newN)
      .fill(0)
      .map((_, i) =>
        Array(newN)
          .fill(0)
          .map((_, j) =>
            i < formData.matrixA.length && j < formData.matrixA[0].length
              ? formData.matrixA[i][j]
              : i === j
              ? 1
              : 0
          )
      );

    const newVectorB = Array(newN)
      .fill(0)
      .map((_, i) => (i < formData.vectorB.length ? formData.vectorB[i] : 0));

    const newVectorX0 = Array(newN)
      .fill(0)
      .map((_, i) => (i < formData.vectorX0.length ? formData.vectorX0[i] : 0));

    setFormData({
      ...formData,
      n: newN,
      matrixA: newMatrixA,
      vectorB: newVectorB,
      vectorX0: newVectorX0,
    });
  };

  const updateMatrixA = (i, j, value) => {
    const newMatrix = formData.matrixA.map((row, rowIdx) =>
      row.map((cell, colIdx) =>
        rowIdx === i && colIdx === j ? value : cell
      )
    );
    setFormData({ ...formData, matrixA: newMatrix });
  };

  const updateVectorB = (i, value) => {
    const newVector = [...formData.vectorB];
    newVector[i] = value;
    setFormData({ ...formData, vectorB: newVector });
  };

  const updateVectorX0 = (i, value) => {
    const newVector = [...formData.vectorX0];
    newVector[i] = value;
    setFormData({ ...formData, vectorX0: newVector });
  };

  const handleNormChange = (e) => setFormData({ ...formData, norm: e.target.value });
  const handleTolChange = (e) => setFormData({ ...formData, tol: e.target.value });
  const handleMaxIterationsChange = (e) => setFormData({ ...formData, maxIterations: Number(e.target.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    setResults(null);

    try {
      const requestData = {
        matrix: formData.matrixA,
        vector_b: formData.vectorB,
        vector_x0: formData.vectorX0,
        norm: formData.norm,
        tol: formData.tol,
        max_count: formData.maxIterations,
        method: "jacobi",
      };

      const response = await api.post("calculations/cap2/jacobi/", requestData);
      setResults(response.data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Error en el cálculo");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="bg-gray-900/80 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="px-4 flex items-center text-teal-400 hover:text-teal-300 mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Volver</span>
              </Link>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">FRACTAL</span>
            </div>
            <div className="text-white font-medium">Jacobi</div>
            <button onClick={() => setShowInfo(!showInfo)} className="text-teal-400 hover:text-teal-300 flex items-center">
              <Info className="h-5 w-5 mr-1" /> <span>Info</span>
            </button>

            <button
              onClick={() => navigate("/informeMatrix")}
              className="flex items-center text-teal-400 hover:text-teal-300 transition-colors"
              >
                Ir al Informe
              </button>
          </div>
        </div>
      </header>

      {showInfo && (
        <div className="bg-gray-800/80 border-b border-gray-700 py-2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-teal-400" /> Método de Jacobi y Gauss-Seidel
              </h3>
              <p className="text-gray-300">Métodos iterativos para resolver sistemas lineales Ax=b.</p>
            </div>
          </div>
        </div>
      )}

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {methodFormTemplate({
              n: formData.n,
              matrixA: formData.matrixA,
              vectorB: formData.vectorB,
              vectorX0: formData.vectorX0,
              norm: formData.norm,
              tol: formData.tol,
              maxIterations: formData.maxIterations,
              onNChange: updateMatrixSize,
              onMatrixAChange: updateMatrixA,
              onVectorBChange: updateVectorB,
              onVectorX0Change: updateVectorX0,
              onNormChange: handleNormChange,
              onTolChange: handleTolChange,
              onMaxIterationsChange: handleMaxIterationsChange,
              onSubmit: handleSubmit,
              isLoading: isCalculating,
              error,
              submitText: "Calcular",
              methodName: "Jacobi",
            })}
          </div>
          <div>
            {results ? (
              <MethodResults results={results} methodName="jacobi" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <span className="text-lg">Ingrese los datos y calcule para ver resultados.</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jacobi;