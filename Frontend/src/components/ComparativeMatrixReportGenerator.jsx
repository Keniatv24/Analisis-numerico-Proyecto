import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, ArrowLeft, Calculator } from "lucide-react";


const executeMatrixMethod = async (method, params) => {
 
  const base = 'http://127.0.0.1:8000/calculations/cap2/';
  let url = "";
  const payload = {
    matrix: params.matrixA,
    vector_b: params.vectorB,
    vector_x0: params.vectorX0,
    norm: params.norm,
    tol: params.tolerance,
    max_count: params.maxIterations,
  };

  if (method === "jacobi") url = base + "jacobi/";
  if (method === "gaussSeidel") url = base + "gaussSeidel/";
  if (method === "sor") {
    url = base + "sor/";
    payload.w = params.w;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      return {
        converged: false,
        solution: null,
        iterations: 0,
        error: "Respuesta inválida del servidor",
        spectralRadius: null,
        conclusion: "Error: respuesta inválida del servidor.",
      };
    }

    if (!res.ok) {
      const msg = data?.error || `Error HTTP ${res.status}`;
      return {
        converged: false,
        solution: null,
        iterations: 0,
        error: msg,
        spectralRadius: null,
        conclusion: `Error al ejecutar el método: ${msg}`,
      };
    }

    const iterArray = Array.isArray(data.iterations) ? data.iterations : [];
    const iterationsCount = iterArray.length;
    const lastError =
      iterationsCount > 0 ? iterArray[iterationsCount - 1][1] : null;

    return {
      converged: Boolean(
        data.conclusion &&
          data.conclusion.toLowerCase().includes("converg")
      ),
      solution: data.final_solution ?? null,
      iterations: iterationsCount,
      error: lastError,
      spectralRadius: data.spectral_radius ?? null,
      conclusion: data.conclusion ?? null,
    };
  } catch (err) {
    const msg = err?.message || "Error de red";
    return {
      converged: false,
      solution: null,
      iterations: 0,
      error: msg,
      spectralRadius: null,
      conclusion: `Error de comunicación con el servidor: ${msg}`,
    };
  }
};


const matrixMethods = [
  { id: "jacobi", name: "Jacobi", color: "bg-blue-500" },
  { id: "gaussSeidel", name: "Gauss-Seidel", color: "bg-green-500" },
  { id: "sor", name: "SOR", color: "bg-purple-500" },
];


const generateReportText = (data) => {
  return `INFORME COMPARATIVO DE MÉTODOS DE MATRICES

Fecha: ${new Date(data.timestamp).toLocaleString()}
Matriz A: ${JSON.stringify(data.problemParams.matrixA)}
Vector b: ${JSON.stringify(data.problemParams.vectorB)}

RESULTADOS:
${data.results
  .map(
    (r) =>
      `- ${r.name}: converged=${r.converged}, iterations=${r.iterations}, error=${r.error}`
  )
  .join("\n")}`;
};


const ComparativeMatrixReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [problemParams, setProblemParams] = useState({
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
    tolerance: "1e-7",
    maxIterations: 100,
    w: 1.5,
  });


  const analyzeResults = (results) => {
    const convergedMethods = results.filter((r) => r.converged);
    if (convergedMethods.length === 0) {
      return {
        mostAccurate: null,
        fewestIterations: null,
        convergenceRate: 0,
        avgIterations: 0,
        recommendation: null,
      };
    }

    const mostAccurate = convergedMethods.reduce((min, m) =>
      m.error < min.error ? m : min
    , convergedMethods[0]);

    const fewestIterations = convergedMethods.reduce((min, m) =>
      m.iterations < min.iterations ? m : min
    , convergedMethods[0]);

    const convergenceRate = convergedMethods.length / results.length;

    const avgIterations =
      Math.round(
        (convergedMethods.reduce((s, m) => s + m.iterations, 0) /
          convergedMethods.length) *
          100
      ) / 100;

    return {
      mostAccurate,
      fewestIterations,
      convergenceRate,
      avgIterations,
      recommendation: fewestIterations.id,
    };
  };

  const generateComparativeReport = async () => {
    setIsGenerating(true);
    try {
      const promises = matrixMethods.map((m) =>
        executeMatrixMethod(m.id, problemParams)
      );
      const results = await Promise.all(promises);

      const methodResults = matrixMethods.map((method, index) => ({
        ...method,
        ...results[index],
      }));

      const analysis = analyzeResults(methodResults);

      setReportData({
        timestamp: new Date().toISOString(),
        problemParams,
        results: methodResults,
        analysis,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

 
  const exportReport = () => {
    if (!reportData) return;
    const reportText = generateReportText(reportData);
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `informe_comparativo_matrices_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

 
  if (!reportData) {
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
        <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition"
              >
                <ArrowLeft className="h-5 w-5" /> Volver
              </Link>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                <span className="font-editorial tracking-wide text-xl">
                  PulsoMatematico
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="px-10 max-w-3xl mx-auto p-6">
          <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] overflow-hidden shadow-soft">
            <div className="px-6 py-6 border-b border-[var(--line)]">
              <h1 className="text-2xl font-editorial">
                Comparador de Métodos de Matrices
              </h1>
              <p className="text-[var(--ink-soft)] mt-1">
                Complete los parámetros y genere el informe comparativo.
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4 p-4 rounded-lg border-l-4 border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/25">
                <p className="text-[var(--ink-soft)] text-sm">
                  Este generador ejecutará Jacobi, Gauss-Seidel y SOR y
                  creará un informe comparativo.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Tamaño n</label>
                  <input
                    type="number"
                    value={problemParams.n}
                    onChange={(e) => {
                      const n = Number(e.target.value) || 1;
                      setProblemParams((prev) => ({ ...prev, n }));
                    }}
                    className="w-28 px-3 py-2 border border-[var(--line)] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Tolerancia
                  </label>
                  <input
                    type="text"
                    value={problemParams.tolerance}
                    onChange={(e) =>
                      setProblemParams((p) => ({
                        ...p,
                        tolerance: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-xl"
                  />
                </div>

                <button
                  onClick={generateComparativeReport}
                  disabled={isGenerating}
                  className="btn-copper py-2 rounded-2xl w-full mt-4"
                >
                  {isGenerating ? (
                    "Generando..."
                  ) : (
                    <>
                      <Calculator className="inline mr-2" /> Generar Informe
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-6 shadow-soft mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-editorial">
                Informe Comparativo de Métodos de Matrices
              </h1>
              <p className="text-[var(--ink-soft)]">
                Generado el{" "}
                {new Date(reportData.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={exportReport}
              className="btn-copper py-2 px-3 rounded-2xl inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reportData.results.map((result) => (
            <div
              key={result.id}
              className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-4 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${result.color}`}
                  />
                  <h3 className="font-semibold">{result.name}</h3>
                </div>
                <div className="text-sm text-[var(--ink-soft)]">
                  Iteraciones:{" "}
                  {typeof result.iterations === "number"
                    ? result.iterations
                    : "N/A"}
                </div>
              </div>

              <div className="mt-3 text-[var(--ink-soft)]">
                Conclusión:{" "}
                {result.conclusion
                  ? result.conclusion
                  : result.error
                  ? `Error: ${result.error}`
                  : "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparativeMatrixReportGenerator;
