import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calculator, Trophy, Clock, BarChart3 } from 'lucide-react';
import PointsForm from './methods/cap3/PointsForm';
import Table, { ResultsCard, Poly } from './methods/cap3/ResultsBlocks';
import { postVandermonde, postNewtonInterpolante, postLagrange, postSplineCubico } from '../api/cap3.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const methods = [
  { id: 'vandermonde', name: 'Vandermonde', color: 'bg-[var(--copper-700)]' },
  { id: 'newton', name: 'Newton Interpolante', color: 'bg-[var(--sage-700)]' },
  { id: 'lagrange', name: 'Lagrange', color: 'bg-[var(--copper-800)]' },
  { id: 'splineCubico', name: 'Spline Cúbico Natural', color: 'bg-[var(--ink-soft)]' },
];

const runMethod = async (id, payload) => {
  const startTime = performance.now();
  try {
    let result;
    if (id === 'vandermonde') result = await postVandermonde(payload);
    else if (id === 'newton') result = await postNewtonInterpolante(payload);
    else if (id === 'lagrange') result = await postLagrange(payload);
    else if (id === 'splineCubico') result = await postSplineCubico(payload);
    else result = null;
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    return { ...result, executionTime };
  } catch (e) {
    const endTime = performance.now();
    return { error: e?.message || String(e), executionTime: endTime - startTime };
  }
};

export default function ComparativeInterpolationReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState(null);

  const [formData, setFormData] = useState({
    // Puntos de ejemplo suaves
    points: [
      [0, 1],
      [1, 2.7182818],
      [2, 7.3890561],
      [3, 20.0855369],
    ],
    x_eval: [0.5, 1.5, 2.5, 3.0],
  });

  const onSubmit = async ({ points, x_eval }) => {
    setIsGenerating(true);
    setReport(null);
    try {
      const payload = { points, x_eval };
      const promises = methods.map((m) => runMethod(m.id, payload));
      const results = await Promise.all(promises);
      const items = methods.map((m, i) => ({ meta: m, data: results[i] }));

      const analysis = buildAnalysis(items, x_eval, points);

      setReport({ timestamp: new Date().toISOString(), input: { points, x_eval }, items, analysis });
      // Scroll up to show report
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsGenerating(false);
    }
  };

  const buildAnalysis = (items, x_eval, points) => {
    // Calcular tiempos de ejecución
    const timingData = items.map(it => ({
      name: it.meta.name,
      time: it.data?.executionTime || 0,
      color: it.meta.color
    }));

    // Requiere puntos de evaluación para comparar
    if (!x_eval || !x_eval.length) return { note: 'Sin puntos de evaluación para comparar salidas.', timingData };

    // y_eval por método
    const methodY = items.reduce((acc, it) => {
      const arr = it?.data?.y_eval;
      if (Array.isArray(arr)) acc[it.meta.id] = arr;
      return acc;
    }, {});

    const methodIds = Object.keys(methodY);
    if (methodIds.length < 2) return { note: 'Resultados insuficientes para comparación cuantitativa.', timingData };

    // Métrica 1: dispersión máxima por x (igual que antes)
    const perX = x_eval.map((_, idx) => {
      const vals = methodIds
        .map((id) => methodY[id]?.[idx])
        .filter((v) => typeof v === 'number' && Number.isFinite(v));
      if (!vals.length) return { maxDiff: null, median: null };
      const sorted = [...vals].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      return { maxDiff: Math.abs(max - min), median };
    });

    const maxDiff = perX.reduce((m, r) => (r.maxDiff != null && r.maxDiff > m ? r.maxDiff : m), 0);
    const validX = perX.filter((r) => r.maxDiff != null && typeof r.median === 'number');
    const avgDiff = validX.reduce((s, r) => s + r.maxDiff, 0) / (validX.length || 1);

    // Métrica 2 (para definir "mejor método"): 
    // Menor desviación absoluta media respecto a la mediana de consenso por cada x_eval
    const scores = {};
    for (const id of methodIds) {
      let sum = 0;
      let count = 0;
      for (let i = 0; i < x_eval.length; i++) {
        const yi = methodY[id]?.[i];
        const med = perX[i]?.median;
        if (typeof yi === 'number' && Number.isFinite(yi) && typeof med === 'number') {
          sum += Math.abs(yi - med);
          count += 1;
        }
      }
      scores[id] = count ? sum / count : Number.POSITIVE_INFINITY;
    }

    const bestMethodId = Object.entries(scores).reduce((best, [id, score]) => {
      if (!best) return id;
      return score < scores[best] ? id : best;
    }, null);

    // Calcular errores relativos entre métodos
    const errorTable = [];
    if (x_eval && x_eval.length) {
      for (let i = 0; i < x_eval.length; i++) {
        const row = { x: x_eval[i] };
        for (const id of methodIds) {
          const yi = methodY[id]?.[i];
          const med = perX[i]?.median;
          if (typeof yi === 'number' && typeof med === 'number' && med !== 0) {
            row[id] = Math.abs((yi - med) / med);
          } else {
            row[id] = null;
          }
        }
        errorTable.push(row);
      }
    }

    // Preparar datos para gráfica
    const chartData = x_eval ? x_eval.map((x, i) => {
      const point = { x };
      for (const id of methodIds) {
        point[id] = methodY[id]?.[i];
      }
      return point;
    }) : [];

    return { maxDiff, avgDiff, scores, bestMethodId, timingData, errorTable, chartData, methodIds };
  };

  const exportTxt = () => {
    if (!report) return;
    const { input, items, analysis, timestamp } = report;
    const bestName = analysis?.bestMethodId ? (items.find(it => it.meta.id === analysis.bestMethodId)?.meta.name || analysis.bestMethodId) : 'N/D';
    const text = [
      'INFORME COMPARATIVO – Interpolación (Capítulo 3)',
      `Fecha: ${new Date(timestamp).toLocaleString()}`,
      `Puntos: ${JSON.stringify(input.points)}`,
      `x_eval: ${JSON.stringify(input.x_eval)}`,
      '',
      `Mejor método (criterio consenso): ${bestName}`,
      '',
      'Resultados:',
      ...items.map((it) => `- ${it.meta.name}: ${summaryLine(it)}`),
      '',
      'Análisis:',
      analysis?.note ? `• ${analysis.note}` : `• max |Δ| entre métodos: ${analysis.maxDiff}\n• promedio |Δ|: ${analysis.avgDiff}`,
      ...(analysis?.scores ? ['','Puntajes (desviación media respecto a la mediana – menor es mejor):',
        ...Object.entries(analysis.scores).map(([id, sc]) => {
          const nm = items.find(it => it.meta.id === id)?.meta.name || id;
          return `  - ${nm}: ${Number.isFinite(sc) ? sc : 'N/D'}`;
        })
      ] : []),
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe_interpolacion_cap3_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryLine = (it) => {
    if (it.meta.id === 'newton') return it?.data?.polynomial_newton ? 'polinomio (Newton) disponible' : it?.data?.error || 'sin datos';
    if (it.meta.id === 'vandermonde') return it?.data?.polynomial ? 'polinomio (estándar) disponible' : it?.data?.error || 'sin datos';
    if (it.meta.id === 'lagrange') return it?.data?.polynomial ? 'polinomio (Lagrange) disponible' : it?.data?.error || 'sin datos';
    if (it.meta.id === 'splineCubico') return it?.data?.segments ? `${it.data.segments.length} segmentos` : it?.data?.error || 'sin datos';
    return 'sin datos';
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/capitulo-3" className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition">
              <ArrowLeft className="h-5 w-5" /> <span>Volver</span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
              <span className="font-editorial tracking-wide text-xl">PulsoMatematico</span>
            </div>
          </div>
          <div className="text-[17px] font-editorial">Informe Capítulo 3 – Interpolación</div>
        </div>
      </header>

      {!report ? (
        <main className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
              <div className="h-2 w-full bg-[var(--copper)]" />
              <div className="p-7">
                <h2 className="font-editorial text-3xl">Configurar datos</h2>
                <p className="text-[var(--ink-soft)] mt-1">Ingresa los puntos y, opcionalmente, x a evaluar. Se ejecutarán los 4 métodos.</p>

                <div className="mt-6">
                  <PointsForm
                    onSubmit={onSubmit}
                    isLoading={isGenerating}
                    error={null}
                    methodName="Informe Cap. 3"
                  />
                </div>

                <div className="mt-4 text-sm text-[var(--ink-soft)]">
                  Consejo: usa de 4 a 8 puntos para apreciar diferencias numéricas entre métodos.
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-7 shadow-soft mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-editorial text-3xl">Informe Comparativo – Interpolación</h1>
              <p className="text-[var(--ink-soft)]">Generado el {new Date(report.timestamp).toLocaleString()}</p>
            </div>
            <button onClick={exportTxt} className="btn-copper rounded-2xl px-5 py-3 inline-flex items-center gap-2 shadow-card hover:shadow-lg transition">
              <Download className="h-5 w-5" /> Exportar
            </button>
          </div>

          {/* Recomendación */}
          {report.analysis?.bestMethodId && (
            <div className="rounded-xxl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_80%,var(--copper)_20%)]/35 shadow-soft p-7 mb-6">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-full bg-[var(--copper)] text-white grid place-items-center shadow-soft">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl">
                    Mejor método: {report.items.find(it => it.meta.id === report.analysis.bestMethodId)?.meta.name}
                  </h2>
                  <p className="text-[var(--ink-soft)]">Criterio: mínima desviación absoluta media respecto a la mediana de consenso en x_eval.</p>
                </div>
              </div>
            </div>
          )}

          {/* Resumen del problema */}
          <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-7 shadow-soft mb-6">
            <h2 className="font-editorial text-2xl mb-4">Datos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
                <p className="text-[var(--ink-soft)] text-sm mb-1">Puntos</p>
                <pre className="font-mono text-sm whitespace-pre-wrap">{JSON.stringify(report.input.points)}</pre>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
                <p className="text-[var(--ink-soft)] text-sm mb-1">x a evaluar</p>
                <pre className="font-mono text-sm whitespace-pre-wrap">{JSON.stringify(report.input.x_eval)}</pre>
              </div>
            </div>
          </div>

          {/* Gráfica comparativa de interpolaciones */}
          {report.analysis?.chartData && report.analysis.chartData.length > 0 && (
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-7 shadow-soft mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-[var(--copper)]" />
                <h2 className="font-editorial text-2xl">Gráfica Comparativa de Interpolaciones</h2>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[var(--line)]">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={report.analysis.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="x" stroke="#6b7280" label={{ value: 'x', position: 'insideBottom', offset: -5 }} />
                    <YAxis stroke="#6b7280" label={{ value: 'y', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Legend />
                    {report.analysis.methodIds?.map((id, idx) => {
                      const method = report.items.find(it => it.meta.id === id);
                      const colors = ['#92400e', '#365314', '#7c2d12', '#1f2937'];
                      return (
                        <Line
                          key={id}
                          type="monotone"
                          dataKey={id}
                          name={method?.meta.name || id}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tabla de tiempos de ejecución */}
          {report.analysis?.timingData && (
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-7 shadow-soft mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-[var(--copper)]" />
                <h2 className="font-editorial text-2xl">Tiempos de Ejecución</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 border border-[var(--line)]">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.analysis.timingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" angle={-15} textAnchor="end" height={80} />
                      <YAxis stroke="#6b7280" label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Bar dataKey="time" name="Tiempo (ms)">
                        {report.analysis.timingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#92400e', '#365314', '#7c2d12', '#1f2937'][index % 4]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[var(--line)]">
                  <h3 className="font-semibold mb-3">Detalles de Tiempo</h3>
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-3 py-2 text-left">Método</th>
                          <th className="px-3 py-2 text-right">Tiempo (ms)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.analysis.timingData.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="px-3 py-2">{item.name}</td>
                            <td className="px-3 py-2 text-right font-mono">{item.time.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabla de errores relativos */}
          {report.analysis?.errorTable && report.analysis.errorTable.length > 0 && (
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-7 shadow-soft mb-6">
              <h2 className="font-editorial text-2xl mb-4">Errores Relativos por Punto</h2>
              <p className="text-[var(--ink-soft)] text-sm mb-4">Error relativo de cada método respecto a la mediana de consenso</p>
              <div className="bg-white rounded-xl p-4 border border-[var(--line)] overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--copper-800)] text-white">
                      <th className="px-3 py-2 text-left">x</th>
                      {report.analysis.methodIds?.map(id => {
                        const method = report.items.find(it => it.meta.id === id);
                        return <th key={id} className="px-3 py-2 text-right">{method?.meta.name || id}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {report.analysis.errorTable.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-3 py-2 font-mono">{row.x}</td>
                        {report.analysis.methodIds?.map(id => (
                          <td key={id} className="px-3 py-2 text-right font-mono">
                            {row[id] !== null && row[id] !== undefined ? row[id].toExponential(4) : 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resultados por método */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {report.items.map((it) => (
              <ResultsCard key={it.meta.id} title={it.meta.name}>
                {/* Polinomios o segmentos */}
                {it.meta.id === 'newton' && it.data?.polynomial_newton && (
                  <Poly label="Polinomio (Newton)" text={it.data.polynomial_newton} />
                )}
                {it.meta.id === 'vandermonde' && it.data?.polynomial && (
                  <Poly label="Polinomio (estándar)" text={it.data.polynomial} />
                )}
                {it.meta.id === 'lagrange' && it.data?.polynomial && (
                  <Poly label="Polinomio (Lagrange)" text={it.data.polynomial} />
                )}
                {it.meta.id === 'splineCubico' && it.data?.segments && (
                  <Table title="Segmentos (a,b,c,d)" data={it.data.segments.map((s) => [`${s.interval[0]} - ${s.interval[1]}`, s.a, s.b, s.c, s.d])} />
                )}

                {/* Tablas adicionales */}
                {it.meta.id === 'newton' && it.data?.dd_table && (
                  <Table title="Tabla diferencias divididas" data={it.data.dd_table} />
                )}
                {it.meta.id === 'vandermonde' && it.data?.vandermonde && (
                  <Table title="Matriz Vandermonde" data={it.data.vandermonde} />
                )}
                {it.meta.id === 'lagrange' && it.data?.basis && (
                  <Table title="Bases L_i coeficientes" data={it.data.basis} />
                )}

                {/* Evaluaciones */}
                {it.data?.x_eval && it.data?.y_eval && (
                  <Table title="Evaluaciones y(x)" data={it.data.y_eval.map((v, i) => [it.data.x_eval[i], v])} />
                )}

                {/* Tiempo de ejecución */}
                {it.data?.executionTime !== undefined && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-900">⏱️ Tiempo: <strong>{it.data.executionTime.toFixed(2)} ms</strong></p>
                  </div>
                )}

                {/* Errores */}
                {it.data?.error && (
                  <div className="mt-3 text-[var(--ink-soft)] text-sm">Error: {it.data.error}</div>
                )}
              </ResultsCard>
            ))}
          </div>

          {/* Análisis simple */}
          <div className="mt-6 rounded-xxl border border-[var(--line)] bg-[var(--card)] p-7 shadow-soft">
            <h2 className="font-editorial text-2xl mb-4">Análisis</h2>
            {report.analysis?.note ? (
              <div className="text-[var(--ink-soft)]">{report.analysis.note}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
                    <p className="text-[var(--ink-soft)] text-sm">Máxima diferencia |Δ| entre métodos</p>
                    <p className="text-2xl font-semibold">{report.analysis.maxDiff}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
                    <p className="text-[var(--ink-soft)] text-sm">Promedio |Δ| entre métodos</p>
                    <p className="text-2xl font-semibold">{report.analysis.avgDiff}</p>
                  </div>
                </div>

                {report.analysis?.scores && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Desviación media respecto a la mediana (menor es mejor)</h3>
                    <Table
                      title={null}
                      data={Object.entries(report.analysis.scores).map(([id, sc]) => {
                        const nm = report.items.find(it => it.meta.id === id)?.meta.name || id;
                        const val = Number.isFinite(sc) ? sc : null;
                        return [nm, val !== null ? Number(val).toPrecision(6) : 'N/D'];
                      })}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
