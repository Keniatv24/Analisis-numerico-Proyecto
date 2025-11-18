import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";

const DIRECT_METHODS_CAP4 = [
  "LU simple",
  "LU con pivoteo",
  "Crout",
  "Doolittle",
  "Cholesky",
];

const ComparativeCap4Report = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cap4DirectMethodsReport");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const exportReport = () => {
    if (!entries.length) return;

    const header = `INFORME COMPARATIVO – CAPÍTULO 4 (Métodos Directos)

Fecha del informe: ${new Date().toLocaleString()}

`;

    const body = DIRECT_METHODS_CAP4.map((name) => {
      const e = entries.find((x) => x.method === name);
      if (!e) return `- ${name}: No se ha ejecutado.\n`;

      const timeStr =
        typeof e.runtimeMs === "number"
          ? `${e.runtimeMs.toFixed(2)} ms`
          : "No disponible";

      const firstX =
        Array.isArray(e.solution) && e.solution.length
          ? Number(e.solution[0]).toPrecision(6)
          : "No disponible";

      return (
        `- ${name}:\n` +
        `    Conclusión: ${e.conclusion}\n` +
        `    Tiempo de cálculo: ${timeStr}\n` +
        `    Primer valor de x: ${firstX}\n`
      );
    }).join("\n");

    const content = header + body;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Informe_Capitulo4_MetodosDirectos.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  // (opcional) calcular el más rápido para resaltarlo
  const minRuntime =
    entries.length > 0
      ? Math.min(
          ...entries
            .filter((e) => typeof e.runtimeMs === "number")
            .map((e) => e.runtimeMs)
        )
      : null;

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <header className="sticky top-0 z-10 bg-[var(--paper)] border-b border-[var(--line)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to="/capitulo-4"
            className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)]"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </Link>
          <span className="font-editorial tracking-wide text-xl">
            PulsoMatemático
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-editorial">
              Informe Comparativo – Capítulo 4
            </h1>
            <p className="text-[var(--ink-soft)]">
              {entries.length
                ? "Métodos ejecutados correctamente."
                : "Ejecuta primero uno o más métodos del capítulo 4."}
            </p>
          </div>
          <button
            onClick={exportReport}
            disabled={!entries.length}
            className="btn-copper py-2 px-3 rounded-2xl disabled:opacity-50"
          >
            <Download className="inline h-4 w-4 mr-1" />
            Exportar
          </button>
        </div>

        <div className="space-y-6">
          {DIRECT_METHODS_CAP4.map((name) => {
            const e = entries.find((i) => i.method === name);

            return (
              <div
                key={name}
                className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-5 shadow-soft"
              >
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {name}
                  {e &&
                    typeof e.runtimeMs === "number" &&
                    e.runtimeMs === minRuntime && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Más rápido
                      </span>
                    )}
                </h3>

                {e ? (
                  <>
                    <p className="mt-2 text-[var(--ink-soft)]">
                      <strong>Conclusión:</strong>{" "}
                      {e.conclusion || "No disponible"}
                    </p>

                    {e.solution && (
                      <p className="mt-2 text-[var(--ink-soft)]">
                        <strong>Primer valor de x:</strong>{" "}
                        {Number(e.solution[0]).toPrecision(6)}
                      </p>
                    )}

                    {typeof e.runtimeMs === "number" && (
                      <p className="mt-2 text-[var(--ink-soft)]">
                        <strong>Tiempo de cálculo:</strong>{" "}
                        {e.runtimeMs.toFixed(2)} ms
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-[var(--ink-soft)]">
                    No se ha ejecutado este método.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ComparativeCap4Report;
