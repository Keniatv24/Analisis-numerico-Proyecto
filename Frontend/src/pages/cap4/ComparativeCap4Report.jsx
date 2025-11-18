import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Trophy,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

const METHODS_CAP4 = [
  { key: "lu", name: "LU simple", color: "bg-[var(--copper-700)]" },
  { key: "lu_pivoteo", name: "LU con pivoteo", color: "bg-[var(--sage-700)]" },
  { key: "crout", name: "Crout", color: "bg-[var(--copper-600)]" },
  { key: "doolittle", name: "Doolittle", color: "bg-[var(--copper-800)]" },
  { key: "cholesky", name: "Cholesky", color: "bg-[var(--sage-800)]" },
];

const ComparativeCap4Report = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cap4DirectMethodsReport");
      if (!stored) {
        setResults([]);
        return;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        setResults([]);
        return;
      }

      const mapped = METHODS_CAP4.map((m) => {
        const entry = parsed.find((e) => e.method === m.name);

        if (!entry) {
          return {
            ...m,
            hasData: false,
            conclusion: null,
            solution: null,
            runtimeMs: null,
            firstX: null,
            converged: false,
            raw: null,
          };
        }

        let firstX = null;
        if (Array.isArray(entry.solution) && entry.solution.length > 0) {
          const num = Number(entry.solution[0]);
          if (!isNaN(num)) {
            firstX = num.toPrecision(6);
          }
        }

        const converged =
          !!entry.conclusion &&
          entry.conclusion.toLowerCase().includes("ok");

        return {
          ...m,
          hasData: true,
          conclusion: entry.conclusion || "",
          solution: entry.solution || null,
          runtimeMs:
            typeof entry.runtimeMs === "number" ? entry.runtimeMs : null,
          firstX,
          converged,
          raw: entry,
        };
      });

      setResults(mapped);
    } catch (err) {
      console.error("Error leyendo cap4DirectMethodsReport:", err);
      setResults([]);
    }
  }, []);

  const executed = results.filter((r) => r.hasData);
  const withTime = executed.filter((r) => typeof r.runtimeMs === "number");

  const mostEfficient =
    withTime.length > 0
      ? withTime.reduce((min, m) =>
          m.runtimeMs < min.runtimeMs ? m : min
        )
      : null;

  const mostAccurate = executed.find((m) => m.firstX !== null) || mostEfficient;

  const convergenceRate =
    results.length > 0 ? executed.length / results.length : 0;

  const avgRuntime =
    withTime.length > 0
      ? withTime.reduce((sum, m) => sum + (m.runtimeMs || 0), 0) /
        withTime.length
      : null;

  const firstRaw = executed[0] && executed[0].raw;
  const dimension =
    firstRaw && Array.isArray(firstRaw.A) && firstRaw.A.length
      ? `${firstRaw.A.length} x ${firstRaw.A.length}`
      : "No disponible";

  const exportReport = () => {
    if (!results.length) return;

    const header = `INFORME COMPARATIVO – CAPÍTULO 4 (Métodos Directos)
====================================================

Fecha de generación: ${new Date().toLocaleString()}
Dimensión del sistema: ${dimension}
Métodos ejecutados: ${executed.length} de ${results.length}

`;

    const body = results
      .map((r, index) => {
        if (!r.hasData) {
          return `${index + 1}. ${r.name}
   - No se ha ejecutado este método.
`;
        }

        const timeStr =
          typeof r.runtimeMs === "number"
            ? `${r.runtimeMs.toFixed(2)} ms`
            : "No disponible";

        return `${index + 1}. ${r.name}
   - Conclusión: ${r.conclusion || "No disponible"}
   - Primer valor de x: ${r.firstX || "No disponible"}
   - Tiempo de cálculo: ${timeStr}
`;
      })
      .join("\n");

    const summary = `
RESUMEN
-------
Método más eficiente (tiempo): ${
      mostEfficient ? mostEfficient.name : "No disponible"
    }
Método destacado por estabilidad/precisión: ${
      mostAccurate ? mostAccurate.name : "No disponible"
    }
Promedio de tiempo: ${
      avgRuntime !== null ? avgRuntime.toFixed(2) + " ms" : "N/A"
    }
Tasa de convergencia: ${(convergenceRate * 100).toFixed(0)}%

`;

    const content = header + body + "\n" + summary;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Informe_Capitulo4_MetodosDirectos.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- VISTA DEL INFORME ----
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del reporte */}
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/capitulo-4"
                className="inline-flex items-center gap-2 text-[var(--copper-800)] hover:text-[var(--copper)] transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </Link>
              <div>
                <h1 className="font-editorial text-3xl">
                  Informe Comparativo – Capítulo 4
                </h1>
                <p className="text-[var(--ink-soft)]">
                  {results.length
                    ? "Comparación automática de factorizaciones LU / Crout / Doolittle / Cholesky."
                    : "Ejecuta primero uno o más métodos directos para generar el informe."}
                </p>
              </div>
            </div>
            <button
              onClick={exportReport}
              disabled={!results.length}
              className="btn-copper rounded-2xl px-5 py-3 inline-flex items-center gap-2 shadow-card hover:shadow-lg transition disabled:opacity-60"
            >
              <Download className="h-5 w-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Resumen del problema */}
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7 mb-8">
          <h2 className="font-editorial text-2xl mb-6">Resumen del Problema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <p className="text-[var(--ink-soft)] text-sm mb-1">Dimensión</p>
              <p className="font-mono text-lg">{dimension}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <p className="text-[var(--ink-soft)] text-sm mb-1">
                Métodos ejecutados
              </p>
              <p className="font-mono text-lg">
                {executed.length} / {results.length || METHODS_CAP4.length}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <p className="text-[var(--ink-soft)] text-sm mb-1">
                Tasa de convergencia
              </p>
              <p className="font-mono text-lg">
                {(convergenceRate * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Banner Método recomendado */}
        {mostEfficient && (
          <div className="rounded-xxl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_80%,var(--copper)_20%)]/35 shadow-soft p-7 mb-8">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-full bg-[var(--copper)] text-white grid place-items-center shadow-soft">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <h2 className="font-editorial text-2xl">
                  Método Recomendado: {mostEfficient.name}
                </h2>
                <p className="text-[var(--ink-soft)]">
                  Seleccionado por su menor tiempo de cómputo (
                  {mostEfficient.runtimeMs != null
                    ? mostEfficient.runtimeMs.toFixed(2)
                    : "N/A"}{" "}
                  ms).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Métricas clave */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-[var(--sage)]/30 grid place-items-center">
                <Target className="h-6 w-6 text-[var(--copper-900)]" />
              </div>
              <h3 className="font-editorial text-xl">Método Destacado</h3>
            </div>
            <p className="text-2xl font-semibold">
              {mostAccurate ? mostAccurate.name : "N/A"}
            </p>
            <p className="text-[var(--ink-soft)]">
              Considerando estabilidad y calidad de la solución obtenida.
            </p>
          </div>

          <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-[var(--sage)]/30 grid place-items-center">
                <TrendingUp className="h-6 w-6 text-[var(--copper-900)]" />
              </div>
              <h3 className="font-editorial text-xl">Más Eficiente</h3>
            </div>
            <p className="text-2xl font-semibold">
              {mostEfficient ? mostEfficient.name : "N/A"}
            </p>
            <p className="text-[var(--ink-soft)]">
              {mostEfficient && mostEfficient.runtimeMs != null
                ? `${mostEfficient.runtimeMs.toFixed(2)} ms`
                : "Sin datos de tiempo"}
            </p>
          </div>
        </div>

        {/* Resultados detallados */}
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7 mb-8">
          <h2 className="font-editorial text-2xl mb-6">Resultados Detallados</h2>
          <div className="space-y-5">
            {results.map((r, index) => (
              <div
                key={r.key}
                className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-soft hover:shadow transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${r.color}`} />
                    <h3 className="text-lg font-semibold">{r.name}</h3>
                    {r.hasData ? (
                      <span className="inline-flex items-center gap-1 text-[var(--sage-900)]">
                        <CheckCircle className="h-5 w-5" /> Calculado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700">
                        <XCircle className="h-5 w-5" /> Sin datos
                      </span>
                    )}
                  </div>
                  <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-sm text-[var(--ink-soft)]">
                    Rank: #{index + 1}
                  </div>
                </div>

                {r.hasData ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3">
                      <p className="text-[var(--ink-soft)] text-sm mb-1">
                        Primer valor de x
                      </p>
                      <p className="font-mono text-lg">
                        {r.firstX || "No disponible"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3">
                      <p className="text-[var(--ink-soft)] text-sm mb-1">
                        Tiempo de cálculo
                      </p>
                      <p className="font-mono text-lg">
                        {r.runtimeMs != null
                          ? `${r.runtimeMs.toFixed(2)} ms`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3">
                      <p className="text-[var(--ink-soft)] text-sm mb-1">
                        Conclusión
                      </p>
                      <p className="text-sm">
                        {r.conclusion || "No disponible"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[var(--ink-soft)]">
                    No se ha ejecutado este método.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-7">
          <h2 className="font-editorial text-2xl mb-6">
            Estadísticas Generales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center rounded-xl border border-[var(--line)] bg-white p-8 shadow-soft">
              <div className="text-5xl font-bold text-[var(--copper-900)] mb-2">
                {avgRuntime !== null ? avgRuntime.toFixed(2) : "N/A"}
              </div>
              <div className="text-[var(--ink-soft)] text-lg">
                Promedio de tiempo (ms)
              </div>
            </div>
            <div className="text-center rounded-xl border border-[var(--line)] bg-white p-8 shadow-soft">
              <div className="text-5xl font-bold text-[var(--copper-900)] mb-2">
                {(convergenceRate * 100).toFixed(0)}%
              </div>
              <div className="text-[var(--ink-soft)] text-lg">
                Tasa de convergencia
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComparativeCap4Report;
