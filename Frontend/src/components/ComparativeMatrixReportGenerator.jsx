import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  ArrowLeft,
  Calculator,
  CheckCircle,
  XCircle,
  Trophy,
  Target,
  TrendingUp,
} from 'lucide-react';

// Simulación de ejecución de métodos de matrices (debes conectar con tu backend real)
const executeMatrixMethod = async (method, params) => {
  let url = "";
  let payload = {};
  switch (method) {
    case "jacobi":
      url = "http://localhost:8000/calculations/cap2/jacobi/";
      payload = {
        matrix: params.matrixA,
        vector_b: params.vectorB,
        vector_x0: params.vectorX0,
        norm: params.norm,
        tol: params.tolerance,
        max_count: params.maxIterations,
      };
      break;
    case "gaussSeidel":
      url = "http://localhost:8000/calculations/cap2/gaussSeidel/";
      payload = {
        matrix: params.matrixA,
        vector_b: params.vectorB,
        vector_x0: params.vectorX0,
        norm: params.norm,
        tol: params.tolerance,
        max_count: params.maxIterations,
      };
      break;
    case "sor":
      url = "http://localhost:8000/calculations/cap2/sor/";
      payload = {
        matrix: params.matrixA,
        vector_b: params.vectorB,
        vector_x0: params.vectorX0,
        norm: params.norm,
        tol: params.tolerance,
        max_count: params.maxIterations,
        w: params.w,
      };
      break;
    default:
      return null;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();

  // Ajusta según la respuesta real de tu backend
  return {
    converged: data.conclusion?.toLowerCase().includes("converg"),
    solution: data.final_solution,
    iterations: data.iterations?.length || 0,
    error: data.iterations?.length
      ? data.iterations[data.iterations.length - 1][1]
      : null,
    spectralRadius: data.spectral_radius,
    conclusion: data.conclusion,
  };
};

const matrixMethods = [
  { id: 'jacobi', name: 'Jacobi', color: 'bg-blue-500' },
  { id: 'gaussSeidel', name: 'Gauss-Seidel', color: 'bg-green-500' },
  { id: 'sor', name: 'SOR', color: 'bg-purple-500' },
];

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

  const generateComparativeReport = async () => {
    setIsGenerating(true);
    try {
      const startTime = Date.now();

      const promises = matrixMethods.map(method =>
        executeMatrixMethod(method.id, problemParams)
      );

      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      const methodResults = matrixMethods.map((method, index) => ({
        ...method,
        ...results[index]
      }));

      const analysis = analyzeResults(methodResults);

      setReportData({
        timestamp: new Date().toISOString(),
        problemParams,
        results: methodResults,
        analysis
      });

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeResults = (results) => {
    const convergedMethods = results.filter(r => r.converged);

    if (convergedMethods.length === 0) return null;

    const mostAccurate = convergedMethods.reduce((min, method) =>
      method.error < min.error ? method : min
    );

    const fewestIterations = convergedMethods.reduce((min, method) =>
      method.iterations < min.iterations ? method : min
    );

    const convergenceRate = convergedMethods.length / results.length;

    const avgIterations = convergedMethods.reduce((sum, m) => sum + m.iterations, 0) / convergedMethods.length;

    return {
      mostAccurate,
      fewestIterations,
      convergenceRate,
      avgIterations: Math.round(avgIterations * 100) / 100,
      recommendation: fewestIterations.id
    };
  };

  const exportReport = () => {
    if (!reportData) return;
    const reportText = generateReportText(reportData);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe_comparativo_matrices_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportText = (data) => {
    return `
INFORME COMPARATIVO DE MÉTODOS DE MATRICES
==========================================

Fecha de generación: ${new Date(data.timestamp).toLocaleString()}
Matriz A: ${JSON.stringify(data.problemParams.matrixA)}
Vector b: ${JSON.stringify(data.problemParams.vectorB)}
Vector x0: ${JSON.stringify(data.problemParams.vectorX0)}
Norma: ${data.problemParams.norm}
Tolerancia: ${data.problemParams.tolerance}
Iteraciones máximas: ${data.problemParams.maxIterations}
w (SOR): ${data.problemParams.w}

RESULTADOS POR MÉTODO:
${data.results.map(r => `
${r.name}:
- Solución: ${r.solution ? r.solution.map(v => v.toExponential(6)).join(", ") : "N/A"}
- Iteraciones: ${r.iterations}
- Error: ${r.error?.toExponential ? r.error.toExponential(2) : r.error}
- Radio espectral: ${r.spectralRadius}
- Convergió: ${r.converged ? 'Sí' : 'No'}
- Conclusión: ${r.conclusion}
`).join('')}

ANÁLISIS DE RENDIMIENTO:
- Método más preciso: ${data.analysis?.mostAccurate?.name || "N/A"}
- Menor número de iteraciones: ${data.analysis?.fewestIterations?.name || "N/A"}
- Promedio de iteraciones: ${data.analysis?.avgIterations || "N/A"}

RECOMENDACIÓN: ${data.results.find(r => r.id === data.analysis?.recommendation)?.name || "N/A"}
`;
  };

  // Render
  if (!reportData) {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <header className="bg-gray-900/80 border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="px-4 flex items-center text-teal-400 hover:text-teal-300 transition-colors mr-6">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span>Volver</span>
                </Link>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  FRACTAL
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 max-w-2xl mx-auto p-6">
          <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <h1 className="text-3xl font-bold text-white">FRACTAL</h1>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Comparador de Métodos de Matrices</h2>
              <p className="text-teal-100">Complete los siguientes parámetros</p>
            </div>

            <div className="p-8">
              <div className="mb-8 p-4 bg-teal-500/10 rounded-lg border-l-4 border-teal-500">
                <p className="text-teal-300 text-sm">
                  Este generador ejecutará automáticamente Jacobi, Gauss-Seidel y SOR y creará un informe comparativo.
                </p>
              </div>

              <div className="space-y-6">
                {/* Matriz A */}
                <div>
                  <label className="block text-white font-medium mb-3">Matriz A</label>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${problemParams.n}, 1fr)` }}>
                    {problemParams.matrixA.map((row, i) =>
                      row.map((value, j) => (
                        <input
                          key={`a-${i}-${j}`}
                          type="number"
                          value={value}
                          onChange={e => {
                            const val = e.target.value === "" ? "" : Number(e.target.value);
                            const newMatrix = problemParams.matrixA.map((r, ri) =>
                              r.map((c, ci) => (ri === i && ci === j ? val : c))
                            );
                            setProblemParams({ ...problemParams, matrixA: newMatrix });
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                          step="any"
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Vector b */}
                <div>
                  <label className="block text-white font-medium mb-3">Vector b</label>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${problemParams.n}, 1fr)` }}>
                    {problemParams.vectorB.map((value, i) => (
                      <input
                        key={`b-${i}`}
                        type="number"
                        value={value}
                        onChange={e => {
                          const val = e.target.value === "" ? "" : Number(e.target.value);
                          const newB = [...problemParams.vectorB];
                          newB[i] = val;
                          setProblemParams({ ...problemParams, vectorB: newB });
                        }}
                        className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                        step="any"
                      />
                    ))}
                  </div>
                </div>

                {/* Vector x0 */}
                <div>
                  <label className="block text-white font-medium mb-3">Vector x₀</label>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${problemParams.n}, 1fr)` }}>
                    {problemParams.vectorX0.map((value, i) => (
                      <input
                        key={`x0-${i}`}
                        type="number"
                        value={value}
                        onChange={e => {
                          const val = e.target.value === "" ? "" : Number(e.target.value);
                          const newX0 = [...problemParams.vectorX0];
                          newX0[i] = val;
                          setProblemParams({ ...problemParams, vectorX0: newX0 });
                        }}
                        className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                        step="any"
                      />
                    ))}
                  </div>
                </div>

                {/* Parámetros adicionales */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-3">Norma</label>
                    <select
                      value={problemParams.norm}
                      onChange={e => setProblemParams({ ...problemParams, norm: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    >
                      <option value="1">Norma 1 (Manhattan)</option>
                      <option value="2">Norma 2 (Euclidiana)</option>
                      <option value="inf">Norma ∞ (Máximo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-3">w (SOR)</label>
                    <input
                      type="number"
                      value={problemParams.w}
                      onChange={e => setProblemParams({ ...problemParams, w: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                      step="any"
                    />
                  </div>
                </div>

                {/* Configuración básica */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-3">Tolerancia</label>
                    <input
                      type="text"
                      value={problemParams.tolerance}
                      onChange={e => setProblemParams({ ...problemParams, tolerance: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-3">Iteraciones máx.</label>
                    <input
                      type="number"
                      value={problemParams.maxIterations}
                      onChange={e =>
                        setProblemParams({ ...problemParams, maxIterations: Number.parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                {/* Botón */}
                <button
                  onClick={() => {
                    generateComparativeReport();
                    window.scrollTo({ top: -20, behavior: 'auto' });
                  }}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-70 text-white font-medium py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generando informe...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5" />
                      Generar Informe Comparativo
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

  // Render del informe
  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto px-40 py-10 mb-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Informe Comparativo de Métodos de Matrices
              </h1>
              <p className="text-slate-400 text-lg">Generado el {new Date(reportData.timestamp).toLocaleString()}</p>
            </div>
            <button
              onClick={exportReport}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Download className="h-5 w-5" />
              Exportar
            </button>
          </div>
        </div>

        {/* Problem Summary */}
        <div className='py-5'>
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 mb-8 shadow-xl">
            <div className="">
              <h2 className="text-2xl font-bold mb-6 text-white">Resumen del Problema</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <p className="text-slate-400 text-sm font-medium mb-2">Matriz A</p>
                <p className="font-mono text-teal-400 text-lg font-semibold break-all">{JSON.stringify(reportData.problemParams.matrixA)}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <p className="text-slate-400 text-sm font-medium mb-2">Vector b</p>
                <p className="font-mono text-white text-lg">{JSON.stringify(reportData.problemParams.vectorB)}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <p className="text-slate-400 text-sm font-medium mb-2">Vector x₀</p>
                <p className="font-mono text-white text-lg">{JSON.stringify(reportData.problemParams.vectorX0)}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <p className="text-slate-400 text-sm font-medium mb-2">Norma</p>
                <p className="font-mono text-white text-lg">{reportData.problemParams.norm}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Banner */}
        <div className='py-1'>
          <div className="py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-8 border border-amber-400/50 mb-8 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 rounded-full p-4">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Método Recomendado: {reportData.results.find((r) => r.id === reportData.analysis.recommendation)?.name}
                </h2>
                <p className="text-amber-100 text-lg">Basado en el análisis de menor iteraciones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className='py-4'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="py-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/30 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-500/20 rounded-full p-3">
                  <Target className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Más Preciso</h3>
              </div>
              <p className="text-3xl font-bold text-emerald-400 mb-2">{reportData.analysis.mostAccurate.name}</p>
              <p className="text-emerald-200">Mayor precisión en el resultado</p>
            </div>

            <div className="py-2 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-500/20 rounded-full p-3">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Más Eficiente</h3>
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-2">{reportData.analysis.fewestIterations.name}</p>
              <p className="text-purple-200">{reportData.analysis.fewestIterations.iterations} iteraciones</p>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className='py-2'>
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 mb-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-8 text-white">Resultados Detallados</h2>
            <div className="space-y-6">
              {reportData.results.map((result, index) => (
                <div className='py-2' key={result.id}>
                  <div
                    className="py-4 bg-gradient-to-r from-slate-700/60 to-slate-600/60 rounded-xl p-6 border border-slate-500/30 hover:border-teal-500/50 transition-all duration-300 shadow-lg"
                  >
                    <div className="py-1 flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full ${result.color} shadow-lg`}></div>
                        <h3 className="text-xl font-bold text-white">{result.name}</h3>
                        {result.converged ? (
                          <div className="bg-emerald-500/20 rounded-full p-1">
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="bg-red-500/20 rounded-full p-1">
                            <XCircle className="h-6 w-6 text-red-400" />
                          </div>
                        )}
                      </div>
                      <div className="bg-slate-600/50 rounded-lg px-3 py-1">
                        <span className="text-sm text-slate-300 font-medium">Rank: #{index + 1}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-600/30 rounded-lg p-2">
                        <p className="text-slate-400 text-sm font-medium mb-1">Solución</p>
                        <p className="font-mono text-white text-lg">
                          {result.solution ? result.solution.map(v => Number(v).toExponential(6)).join(", ") : "N/A"}
                        </p>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-2">
                        <p className="text-slate-400 text-sm font-medium mb-1">Iteraciones</p>
                        <p className="font-mono text-white text-lg">{result.iterations || "N/A"}</p>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-2">
                        <p className="text-slate-400 text-sm font-medium mb-1">Error</p>
                        <p className="font-mono text-white text-lg">{result.error !== undefined && result.error !== null ? (typeof result.error === "number" ? result.error.toExponential(6) : result.error) : "N/A"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-slate-300 text-sm"><strong>Radio espectral:</strong> {result.spectralRadius !== undefined && result.spectralRadius !== null ? Number(result.spectralRadius).toFixed(5) : "N/A"}</p>
                      <p className="text-slate-300 text-sm"><strong>Conclusión:</strong> {result.conclusion || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="py-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 shadow-xl">
          <h2 className="text-2xl font-bold mb-8 text-white">Estadísticas Generales</h2>
          <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="py-4 text-center bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl p-8 border border-teal-500/30">
              <div className="text-5xl font-bold text-teal-400 mb-3">{reportData.analysis.avgIterations}</div>
              <div className="text-teal-200 text-lg font-medium">Promedio de Iteraciones</div>
            </div>
            <div className="py-4 text-center bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-8 border border-emerald-500/30">
              <div className="text-5xl font-bold text-emerald-400 mb-3">
                {(reportData.analysis.convergenceRate * 100).toFixed(0)}%
              </div>
              <div className="text-emerald-200 text-lg font-medium">Tasa de Convergencia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeMatrixReportGenerator;