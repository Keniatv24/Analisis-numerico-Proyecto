// Frontend/src/components/ComparativeReportGenerator.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

// --- LÓGICA ORIGINAL (sin cambios) ---
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
    root:
      state === "was found"
        ? data.conclusion.split("= ")[1]
        : state === "An approximation"
        ? data.conclusion.split("= ")[1]
        : 0,
    iterations: data.iterations.length,
    converged: state == "not found" ? false : true,
    error:
      data.iterations[data.iterations.length - 1][
        data.iterations[data.iterations.length - 1].length - 1
      ],
  };
};
// --- FIN LÓGICA ORIGINAL ---

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
    { id: 'newton',          name: 'Newton-Raphson',   color: 'bg-[var(--copper-700)]' },
    { id: 'secante',         name: 'Secante',          color: 'bg-[var(--sage-700)]' },
    { id: 'reglaFalsa',      name: 'Regla Falsa',      color: 'bg-[var(--copper-600)]' },
    { id: 'biseccion',       name: 'Bisección',        color: 'bg-[var(--copper-800)]' },
    { id: 'puntoFijo',       name: 'Punto Fijo',       color: 'bg-[var(--ink-soft)]' },
    { id: 'raicesMultiples', name: 'Raíces Múltiples', color: 'bg-[var(--sage-800)]' }
  ];

  const generateComparativeReport = async () => {
    setIsGenerating(true);
    try {
      const startTime = Date.now();
      const promises = methods.map(method => executeMethod(method.id, problemParams));
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime; // (por si luego lo quieres mostrar)

      const methodResults = methods.map((method, index) => ({
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
      recommendation: determineRecommendation(fewestIterations)
    };
  };

  const determineRecommendation = (fewestIterations) => {
    const scores = {};
    [fewestIterations].forEach(method => {
      scores[method.id] = (scores[method.id] || 0) + 1;
    });
    const bestMethod = Object.entries(scores).reduce(
      (max, [id, score]) => (score > max.score ? { id, score } : max),
      { id: null, score: 0 }
    );
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

  // -------- VISTA: SIN REPORTE (Formulario) --------
  if (!reportData) {
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
        {/* Header editorial */}
        <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="inline-flex items-center gap-2 text-[var(--copper-800)] hover:text-[var(--copper)] transition">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Volver</span>
                </Link>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                  <span className="font-editorial tracking-wide text-xl">PulsoMatematico</span>
                </div>
              </div>
              <div className="text-[17px] font-editorial">Generador de Informes Comparativos</div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
              {/* Banda cobre */}
              <div className="h-2 w-full bg-[var(--copper)]" />
              <div className="p-7">
                <h2 className="font-editorial text-3xl">Configurar problema</h2>
                <p className="text-[var(--ink-soft)] mt-1">Completa los parámetros. Se ejecutarán todos los métodos disponibles.</p>

                {/* Tip contextual */}
                <div className="mt-5 p-4 rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/25">
                  <p className="text-sm text-[var(--ink-soft)]">
                    Asegúrate de que la función sea continua en el intervalo. Puedes usar el graficador en el menú para verificar.
                  </p>
                </div>

                {/* Formulario */}
                <div className="mt-6 space-y-6">
                  {/* Función */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Función f(x)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={problemParams.function}
                        onChange={(e) => setProblemParams({ ...problemParams, function: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft pl-12"
                        placeholder="x^3 - 2*x - 5"
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 grid place-items-center pointer-events-none">
                        <span className="text-[var(--ink-soft)] text-sm">f(x)=</span>
                      </div>
                    </div>
                  </div>

                  {/* Intervalo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Límite inferior (a)</label>
                      <input
                        type="number"
                        value={problemParams.a}
                        onChange={(e) => setProblemParams({ ...problemParams, a: Number.parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Límite superior (b)</label>
                      <input
                        type="number"
                        value={problemParams.b}
                        onChange={(e) => setProblemParams({ ...problemParams, b: Number.parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                      />
                    </div>
                  </div>

                  {/* Configuración básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tolerancia</label>
                      <input
                        type="text"
                        value={problemParams.tolerance}
                        onChange={(e) => setProblemParams({ ...problemParams, tolerance: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Iteraciones máx.</label>
                      <input
                        type="number"
                        value={problemParams.maxIterations}
                        onChange={(e) =>
                          setProblemParams({ ...problemParams, maxIterations: Number.parseInt(e.target.value) })
                        }
                        className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                      />
                    </div>
                  </div>

                  {/* Específicos */}
                  <div className="space-y-4">
                    <h3 className="font-editorial text-xl">Parámetros específicos por método</h3>

                    <div>
                      <label className="block text-sm font-medium mb-2">g(x) para Punto Fijo</label>
                      <input
                        type="text"
                        value={problemParams.gfunction}
                        onChange={(e) => setProblemParams({ ...problemParams, gfunction: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                        placeholder="sqrt(2*x + 5)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Derivada f'(x) (Newton y Raíces Múltiples)</label>
                      <input
                        type="text"
                        value={problemParams.firstDerivative}
                        onChange={(e) => setProblemParams({ ...problemParams, firstDerivative: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                        placeholder="3*x^2 - 2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Segunda derivada f''(x) (Raíces Múltiples)</label>
                      <input
                        type="text"
                        value={problemParams.secondDerivative}
                        onChange={(e) => setProblemParams({ ...problemParams, secondDerivative: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                        placeholder="6*x"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">Valor inicial x0</label>
                        <input
                          type="number"
                          value={problemParams.x0}
                          onChange={(e) => setProblemParams({ ...problemParams, x0: Number.parseFloat(e.target.value) })}
                          className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Valor inicial x1</label>
                        <input
                          type="number"
                          value={problemParams.x1}
                          onChange={(e) => setProblemParams({ ...problemParams, x1: Number.parseFloat(e.target.value) })}
                          className="w-full px-4 py-3 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón generar */}
                  <button
                    onClick={() => {
                      generateComparativeReport();
                      window.scrollTo({ top: -20, behavior: 'auto' });
                    }}
                    disabled={isGenerating}
                    className="w-full btn-copper rounded-2xl py-4 px-6 font-semibold shadow-card hover:shadow-lg transition inline-flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
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
        </main>
      </div>
    );
  }

  // -------- VISTA: CON REPORTE --------
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header reporte */}
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-editorial text-3xl">Informe Comparativo de Métodos</h1>
              <p className="text-[var(--ink-soft)]">
                Generado el {new Date(reportData.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={exportReport}
              className="btn-copper rounded-2xl px-5 py-3 inline-flex items-center gap-2 shadow-card hover:shadow-lg transition"
            >
              <Download className="h-5 w-5" />
              Exportar
            </button>
          </div>
        </div>

        {/* Resumen del problema */}
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7 mb-8">
          <h2 className="font-editorial text-2xl mb-6">Resumen del Problema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <p className="text-[var(--ink-soft)] text-sm mb-1">Función</p>
              <p className="font-mono text-[var(--ink)] text-lg">{reportData.problemParams.function}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <p className="text-[var(--ink-soft)] text-sm mb-1">Intervalo</p>
              <p className="font-mono text-lg">[{reportData.problemParams.a}, {reportData.problemParams.b}]</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <p className="text-[var(--ink-soft)] text-sm mb-1">Tolerancia</p>
              <p className="font-mono text-lg">{reportData.problemParams.tolerance}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <p className="text-[var(--ink-soft)] text-sm mb-1">Max. Iteraciones</p>
              <p className="font-mono text-lg">{reportData.problemParams.maxIterations}</p>
            </div>
          </div>
        </div>

        {/* Banner recomendado */}
        <div className="rounded-xxl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_80%,var(--copper)_20%)]/35 shadow-soft p-7 mb-8">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-full bg-[var(--copper)] text-white grid place-items-center shadow-soft">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-editorial text-2xl">
                Método Recomendado: {reportData.results.find(r => r.id === reportData.analysis.recommendation)?.name}
              </h2>
              <p className="text-[var(--ink-soft)]">Basado en el análisis de menor iteraciones</p>
            </div>
          </div>
        </div>

        {/* Métricas clave */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-[var(--sage)]/30 grid place-items-center">
                <Target className="h-6 w-6 text-[var(--copper-900)]" />
              </div>
              <h3 className="font-editorial text-xl">Más Preciso</h3>
            </div>
            <p className="text-2xl font-semibold">{reportData.analysis.mostAccurate.name}</p>
            <p className="text-[var(--ink-soft)]">Mayor precisión en el resultado</p>
          </div>

          <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-[var(--sage)]/30 grid place-items-center">
                <TrendingUp className="h-6 w-6 text-[var(--copper-900)]" />
              </div>
              <h3 className="font-editorial text-xl">Más Eficiente</h3>
            </div>
            <p className="text-2xl font-semibold">{reportData.analysis.fewestIterations.name}</p>
            <p className="text-[var(--ink-soft)]">{reportData.analysis.fewestIterations.iterations} iteraciones</p>
          </div>
        </div>

        {/* Resultados detalle */}
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7 mb-8">
          <h2 className="font-editorial text-2xl mb-6">Resultados Detallados</h2>
          <div className="space-y-5">
            {reportData.results.map((result, index) => (
              <div key={result.id} className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-soft hover:shadow transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${result.color}`} />
                    <h3 className="text-lg font-semibold">{result.name}</h3>
                    {result.converged ? (
                      <span className="inline-flex items-center gap-1 text-[var(--sage-900)]">
                        <CheckCircle className="h-5 w-5" /> Convergió
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700">
                        <XCircle className="h-5 w-5" /> No convergió
                      </span>
                    )}
                  </div>
                  <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-sm text-[var(--ink-soft)]">
                    Rank: #{index + 1}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3">
                    <p className="text-[var(--ink-soft)] text-sm mb-1">Raíz</p>
                    <p className="font-mono text-lg">{result.root || "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3">
                    <p className="text-[var(--ink-soft)] text-sm mb-1">Iteraciones</p>
                    <p className="font-mono text-lg">{result.iterations || "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3">
                    <p className="text-[var(--ink-soft)] text-sm mb-1">Error</p>
                    <p className="font-mono text-lg">{result.error || "N/A"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7">
          <h2 className="font-editorial text-2xl mb-6">Estadísticas Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center rounded-xl border border-[var(--line)] bg-white p-8 shadow-soft">
              <div className="text-5xl font-bold text-[var(--copper-900)] mb-2">{reportData.analysis.avgIterations}</div>
              <div className="text-[var(--ink-soft)] text-lg">Promedio de Iteraciones</div>
            </div>
            <div className="text-center rounded-xl border border-[var(--line)] bg-white p-8 shadow-soft">
              <div className="text-5xl font-bold text-[var(--copper-900)] mb-2">
                {(reportData.analysis.convergenceRate * 100).toFixed(0)}%
              </div>
              <div className="text-[var(--ink-soft)] text-lg">Tasa de Convergencia</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComparativeReportGenerator;
