import { useState } from "react";
import { ArrowLeft, HelpCircle, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import methodFormTemplate from "./methodForm.jsx";
import MethodResults from "./methodResults.jsx";
import api from "../../../../api/config.js";
import { saveCap4DirectMethodResult } from "../../../../utils/cap4ReportStorage";

const LUPage = () => {
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
      .map((_, i) =>
        i < formData.vectorB.length ? formData.vectorB[i] : 0
      );

    setFormData({ n: newN, matrixA: newMatrixA, vectorB: newVectorB });
  };

  const updateMatrixA = (i, j, value) => {
    const newMatrix = formData.matrixA.map((row, ri) =>
      row.map((cell, cj) => (ri === i && cj === j ? value : cell))
    );
    setFormData({ ...formData, matrixA: newMatrix });
  };

  const updateVectorB = (i, value) => {
    const newVector = [...formData.vectorB];
    newVector[i] = value;
    setFormData({ ...formData, vectorB: newVector });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    setResults(null);

    try {
      const requestData = {
        matrix: formData.matrixA,
        vector_b: formData.vectorB,
      };

      // ⏱️ medir tiempo de la llamada
      const t0 = performance.now();
      const response = await api.post("calculations/cap2/lu/", requestData);
      const t1 = performance.now();
      const elapsedMs = t1 - t0;

      const data = response.data;

      const extendedData = {
        ...data,
        runtimeMs: elapsedMs,
      };

      setResults(extendedData);

      // Guardar datos para el informe del capítulo 4
      saveCap4DirectMethodResult({
        methodKey: "lu",
        A: formData.matrixA,
        b: formData.vectorB,
        solution: data.solution,
        conclusion: data.conclusion,
        runtimeMs: elapsedMs,
      });

      // 👇 YA NO navegamos aquí, solo guardamos.
      // El usuario irá al informe cuando haga clic en "Ir al Informe".
      // navigate("/informeCap4", { state: { A: formData.matrixA, b: formData.vectorB } });

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
      {/* Header editorial */}
      <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </Link>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                <span className="font-editorial tracking-wide text-xl">
                  PulsoMatematico
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[17px] font-editorial">LU simple</span>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="inline-flex items-center gap-2 text-[var(--copper-800)] hover:text-[var(--copper)] transition"
              >
                <Info className="h-5 w-5" />
                <span>Info</span>
              </button>

              <button
                onClick={() => navigate("/informeCap4")}
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
                <HelpCircle className="h-5 w-5 text-[var(--copper)]" /> Método
                LU (simple)
              </h3>
              <p className="mt-3 text-[var(--ink-soft)]">
                Factorización A = L·U (Doolittle, diag(L)=1). Si algún pivote de
                U es 0, use “LU con pivoteo”.
              </p>
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
              onNChange: updateMatrixSize,
              onMatrixAChange: updateMatrixA,
              onVectorBChange: updateVectorB,
              onSubmit: handleSubmit,
              isLoading: isCalculating,
              error,
              submitText: "Calcular",
              methodName: "LU simple",
            })}
          </div>
          <div>
            {results ? (
              <div className="h-full flex flex-col">
                {typeof results.runtimeMs === "number" && (
                  <div className="mb-3 text-sm text-[var(--ink-soft)]">
                    Tiempo aproximado de cálculo:{" "}
                    <strong>{results.runtimeMs.toFixed(2)} ms</strong>
                  </div>
                )}
                <MethodResults results={results} />
              </div>
            ) : (
              <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-8 flex flex-col items-center justify-center h-full shadow-soft">
                <div className="h-16 w-16 rounded-full bg-[var(--copper-100)] grid place-items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-[var(--copper-800)]"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M3 15l4-4 4 4 4-4 4 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-editorial mb-1">
                  Sin resultados aún
                </h3>
                <p className="text-[var(--ink-soft)] text-center">
                  Ingrese los datos y calcule para ver resultados.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LUPage;
