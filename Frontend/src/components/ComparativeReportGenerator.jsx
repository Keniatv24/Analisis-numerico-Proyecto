import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import {
  FileText,
  Download,
  PlayCircle,
  Trophy,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  Zap,
  ArrowLeft,
  Calculator
} from 'lucide-react';

// Cambia esto por tus llamadas reales a la API/backend
const executeMethod = async (method, params) => {
  let url = "";
  let payload = {};
  switch (method) {
    case "biseccion":
      url = "http://localhost:8000/calculations/biseccion/";
      payload = {
        function_text: params.function,
        a: params.a,
        b: params.b,
        tol: params.tolerance,
        max_count: params.maxIterations
      };
      break;
    case "reglaFalsa":
      url = "http://localhost:8000/calculations/reglaFalsa/";
      payload = {
        function_text: params.function,
        a: params.a,
        b: params.b,
        tol: params.tolerance,
        max_count: params.maxIterations
      };
      break;
    case "puntoFijo":
      url = "http://localhost:8000/calculations/puntoFijo/";
      payload = {
        function_text: params.function,
        gfunction_text: params.gfunction,
        x0: params.x0,
        tol: params.tolerance,
        max_count: params.maxIterations
      };
      break;
    case "newton":
      url = "http://localhost:8000/calculations/newton/";
      payload = {
        function_text: params.function,
        first_derivate_text: params.firstDerivative,
        x0: params.x0,
        tol: params.tolerance,
        max_count: params.maxIterations
      };
      break;
    case "secante":
      url = "http://localhost:8000/calculations/secante/";
      payload = {
        function_text: params.function,
        x0: params.x0,
        x1: params.x1,
        tol: params.tolerance,
        max_count: params.maxIterations
      };
      break;
    case "raicesMultiples":
      url = "http://localhost:8000/calculations/raicesMultiples/";
      payload = {
        function_text: params.function,
        first_derivate_text: params.firstDerivative,
        second_derivate_text: params.secondDerivative,
        x0: params.x0,
        tol: params.tolerance,
        max_count: params.maxIterations
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
  const state = data.conclusion.includes("The root")
  ? "was found"
  : data.conclusion.includes("An approximation")
  ? "An approximation"
  : "not found";
  return {
    state: state,
    root: state === "was found" ? data.conclusion.split("= ")[1] : state === "An approximation" ? data.conclusion.split("= ")[1] : 0,
    iterations: data.iterations.length,
    converged: state == "not found" ? false : true,
    error: data.iterations[data.iterations.length - 1][data.iterations[data.iterations.length - 1].length - 1]
  };
};

const ComparativeReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [problemParams, setProblemParams] = useState({
    function: "sin(x-43*10^(-3))-x",
    gfunction: "(x)*(sin(x-43*10^(-3))-x)",
    firstDerivative: "cos(x + -43 / 1000) - 1",
    secondDerivative: "-sin(x + -43 / 1000)",
    a: -1,
    b: 1,
    x0: 1,
    x1: 2,
    tolerance: 0.0000001,
    maxIterations: 100
  });

  const methods = [
    { id: 'newton', name: 'Newton-Raphson', color: 'bg-blue-500' },
    { id: 'secante', name: 'Secante', color: 'bg-green-500' },
    { id: 'reglaFalsa', name: 'Regla Falsa', color: 'bg-yellow-500' },
    { id: 'biseccion', name: 'Bisección', color: 'bg-red-500' },
    { id: 'puntoFijo', name: 'Punto Fijo', color: 'bg-pink-500' },
    { id: 'raicesMultiples', name: 'Raíces Múltiples', color: 'bg-purple-500' }
  ];

  const generateComparativeReport = async () => {
    setIsGenerating(true);
    try {
      const startTime = Date.now();

      const promises = methods.map(method =>
        executeMethod(method.id, problemParams)
      );

      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      console.log(results)
      const methodResults = methods.map((method, index) => ({
        ...method,
        ...results[index]
      }));

      console.log(methodResults)

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
      recommendation: determineRecommendation(fewestIterations)
    };
  };

  const determineRecommendation = (fewestIterations) => {
    const scores = {};
    [fewestIterations].forEach(method => {
      scores[method.id] = (scores[method.id] || 0) + 1;
    });
    const bestMethod = Object.entries(scores).reduce((max, [id, score]) =>
      score > max.score ? { id, score } : max, { id: null, score: 0 });
    return bestMethod.id;
  };

  const exportReport = () => {
    if (!reportData) return;
    const reportText = generateReportText(reportData);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe_comparativo_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportText = (data) => {
    return `
INFORME COMPARATIVO DE MÉTODOS NUMÉRICOS
========================================

Fecha de generación: ${new Date(data.timestamp).toLocaleString()}
Función analizada: ${data.problemParams.function}
Intervalo: [${data.problemParams.a}, ${data.problemParams.b}]
Tolerancia: ${data.problemParams.tolerance}

RESULTADOS POR MÉTODO:
${data.results.map(r => `
${r.name}:
- Raíz encontrada: ${r.root}
- Iteraciones: ${r.iterations}
- Error: ${r.error?.toExponential ? r.error.toExponential(2) : r.error}
- Convergió: ${r.converged ? 'Sí' : 'No'}
`).join('')}

ANÁLISIS DE RENDIMIENTO:
- Método más preciso: ${data.analysis.mostAccurate.name}
- Menor número de iteraciones: ${data.analysis.fewestIterations.name}
- Promedio de iteraciones: ${data.analysis.avgIterations}

RECOMENDACIÓN: ${data.results.find(r => r.id === data.analysis.recommendation)?.name}
`;
  };

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
              <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <div className="absolute inset-0 bg-teal-800 rounded-lg transform rotate-45"></div>
                <div className="absolute inset-1 bg-teal-500 rounded-md transform rotate-12"></div>
                <div className="absolute inset-2 bg-teal-400 rounded-sm transform -rotate-12"></div>
                <div className="absolute inset-3 bg-white dark:bg-gray-800 rounded-sm"></div>
                <div className="absolute inset-4 bg-teal-600 rounded-sm transform -rotate-90"></div>
              </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  FRACTAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-40 max-w-2xl mx-auto p-6">
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h1 className="text-3xl font-bold text-white">FRACTAL</h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Generador de Informes Comparativos</h2>
            <p className="text-teal-100">Complete los siguientes parámetros</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Info Box */}
            <div className="mb-8 p-4 bg-teal-500/10 rounded-lg border-l-4 border-teal-500">
              <p className="text-teal-300 text-sm">
                Este generador ejecutará automáticamente todos los métodos numéricos disponibles y creará un informe
                comparativo. Asegúrese de que la función sea continua en el intervalo dado. Para verificar, puede{" "}
                <span className="text-teal-400 font-medium hover:underline cursor-pointer">graficar la función</span>.
              </p>
            </div>

            <div className="space-y-6">
              {/* Función */}
              <div>
                <label className="block text-white font-medium mb-3">Función f(x)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={problemParams.function}
                    onChange={(e) => setProblemParams({ ...problemParams, function: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all pl-12"
                    placeholder="x^3 - 2*x - 5"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 text-sm">f(x)=</span>
                  </div>
                </div>
              </div>

              {/* Intervalo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-3">Límite inferior (a)</label>
                  <input
                    type="number"
                    value={problemParams.a}
                    onChange={(e) => setProblemParams({ ...problemParams, a: Number.parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-3">Límite superior (b)</label>
                  <input
                    type="number"
                    value={problemParams.b}
                    onChange={(e) => setProblemParams({ ...problemParams, b: Number.parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
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
                    onChange={(e) => setProblemParams({ ...problemParams, tolerance: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-3">Iteraciones máx.</label>
                  <input
                    type="number"
                    value={problemParams.maxIterations}
                    onChange={(e) =>
                      setProblemParams({ ...problemParams, maxIterations: Number.parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>

              {/* Parámetros específicos */}
              <div className="space-y-4">
                <h3 className="text-white font-medium text-lg">Parámetros Específicos por Método</h3>

                <div>
                  <label className="block text-white font-medium mb-3">g(x) para Punto Fijo</label>
                  <input
                    type="text"
                    value={problemParams.gfunction}
                    onChange={(e) => setProblemParams({ ...problemParams, gfunction: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    placeholder="sqrt(2*x + 5)"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">
                    Derivada f'(x) para Newton y Raíces Múltiples
                  </label>
                  <input
                    type="text"
                    value={problemParams.firstDerivative}
                    onChange={(e) => setProblemParams({ ...problemParams, firstDerivative: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    placeholder="3*x^2 - 2"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">
                    Segunda derivada f''(x) para Raíces Múltiples
                  </label>
                  <input
                    type="text"
                    value={problemParams.secondDerivative}
                    onChange={(e) => setProblemParams({ ...problemParams, secondDerivative: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    placeholder="6*x"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-3">Valor inicial x0</label>
                    <input
                      type="number"
                      value={problemParams.x0}
                      onChange={(e) => setProblemParams({ ...problemParams, x0: Number.parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-3">Valor inicial x1</label>
                    <input
                      type="number"
                      value={problemParams.x1}
                      onChange={(e) => setProblemParams({ ...problemParams, x1: Number.parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                      step="0.1"
                    />
                  </div>
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

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto px-40 py-10 mb-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Informe Comparativo de Métodos
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
                <p className="text-slate-400 text-sm font-medium mb-2">Función</p>
                <p className="font-mono text-teal-400 text-lg font-semibold">{reportData.problemParams.function}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <p className="text-slate-400 text-sm font-medium mb-2">Intervalo</p>
                <p className="font-mono text-white text-lg">
                  [{reportData.problemParams.a}, {reportData.problemParams.b}]
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <p className="text-slate-400 text-sm font-medium mb-2">Tolerancia</p>
                <p className="font-mono text-white text-lg">{reportData.problemParams.tolerance}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <p className="text-slate-400 text-sm font-medium mb-2">Max. Iteraciones</p>
                <p className="font-mono text-white text-lg">{reportData.problemParams.maxIterations}</p>
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
                <div className='py-2'>
                  <div
                    key={result.id}
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
                        <p className="text-slate-400 text-sm font-medium mb-1">Raíz</p>
                        <p className="font-mono text-white text-lg">{result.root || "N/A"}</p>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-2">
                        <p className="text-slate-400 text-sm font-medium mb-1">Iteraciones</p>
                        <p className="font-mono text-white text-lg">{result.iterations || "N/A"}</p>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-2">
                        <p className="text-slate-400 text-sm font-medium mb-1">Error</p>
                        <p className="font-mono text-white text-lg">{result.error || "N/A"}</p>
                      </div>
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

export default ComparativeReportGenerator;