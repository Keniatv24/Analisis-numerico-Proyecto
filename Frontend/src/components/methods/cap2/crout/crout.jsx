import { useState } from "react";
import { ArrowLeft, HelpCircle, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import methodForm from "./methodForm.jsx";
import MethodResults from "./methodResults.jsx";
import api from "../../../../api/config.js";

const CroutPage = () => {
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
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const updateMatrixSize = (newN) => {
    if (newN < 2 || newN > 10) return;

    const newMatrixA = Array(newN).fill(0).map((_, i) =>
      Array(newN).fill(0).map((_, j) =>
        i < formData.matrixA.length && j < formData.matrixA[0].length
          ? formData.matrixA[i][j]
          : (i === j ? 1 : 0)
      )
    );

    const newVectorB = Array(newN).fill(0).map((_, i) =>
      i < formData.vectorB.length ? formData.vectorB[i] : 0
    );

    setFormData({ n: newN, matrixA: newMatrixA, vectorB: newVectorB });
  };

  const updateMatrixA = (i, j, value) => {
    const newM = formData.matrixA.map((row, ri) =>
      row.map((cell, cj) => (ri === i && cj === j ? value : cell))
    );
    setFormData({ ...formData, matrixA: newM });
  };

  const updateVectorB = (i, value) => {
    const v = [...formData.vectorB];
    v[i] = value;
    setFormData({ ...formData, vectorB: v });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    setResults(null);

    try {
      const payload = { matrix: formData.matrixA, vector_b: formData.vectorB };
      const { data } = await api.post("calculations/cap2/crout/", payload);
      setResults(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err.message ||
        "Error en el cálculo"
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition">
                <ArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                <span className="font-editorial tracking-wide text-xl">PulsoMatematico</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[17px] font-editorial">Crout</span>
              <button onClick={() => setShowInfo(!showInfo)} className="inline-flex items-center gap-2 text-[var(--copper-800)] hover:text-[var(--copper)] transition">
                <Info className="h-5 w-5" />
                <span>Info</span>
              </button>
              <button
                onClick={() => navigate("/informeMatrix")}
                className="book-link inline-flex items-center rounded-xl border border-[var(--line)] px-3 py-1.5 bg-[var(--card)] hover:shadow-soft transition"
              >
                Ir al Informe
              </button>
            </div>
          </div>
        </div>
      </header>

      {showInfo && (
        <div className="border-b border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-5 shadow-soft">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--copper)]" /> Método de Crout
              </h3>
              <p className="mt-3 text-[var(--ink-soft)]">
                Factorización <strong>A = L·U</strong> donde <strong>L</strong> tiene diagonal
                <em> no unitaria</em> y <strong>U</strong> tiene diagonal <em>unitaria</em> (unos).
                Recomendado cuando la matriz es no singular y estable numéricamente; si hay pivotes
                problemáticos, use LU con pivoteo.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {methodForm({
              n: formData.n,
              matrixA: formData.matrixA,
              vectorB: formData.vectorB,
              onNChange: updateMatrixSize,
              onMatrixAChange: updateMatrixA,
              onVectorBChange: updateVectorB,
              onSubmit: handleSubmit,
              isLoading: isCalculating,
              error,
              submitText: "Calcular",
              methodName: "Crout",
            })}
          </div>

          <div>
            {results ? (
              <MethodResults results={results} />
            ) : (
              <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-8 flex flex-col items-center justify-center h-full shadow-soft">
                <div className="h-16 w-16 rounded-full bg-[var(--copper-100)] grid place-items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="h-8 w-8 text-[var(--copper-800)]">
                    <path d="M3 3v18h18" />
                    <path d="M3 15l4-4 4 4 4-4 4 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-editorial mb-1">Sin resultados aún</h3>
                <p className="text-[var(--ink-soft)] text-center">Ingrese los datos y calcule para ver resultados.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CroutPage;
