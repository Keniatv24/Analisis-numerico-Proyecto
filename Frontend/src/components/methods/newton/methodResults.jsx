import fractalHeader from "../../fractalHeader";

const methodResults = ({ results, methodName, functionText }) => {
  const iters = Array.isArray(results?.iterations) ? results.iterations : [];

  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
      {/* Header editorial con tu look & feel */}
      <div className="px-6 pt-4">
        <fractalHeader />
        <div className="mt-2 h-2 w-full rounded-t-xxl bg-[var(--copper)]" />
        <h3 className="mt-3 text-xl font-editorial text-[var(--ink)] text-center">
          Resultados — {methodName}
        </h3>
      </div>

      <div className="px-6 pb-6">
        {/* Función */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-[var(--ink-soft)] mb-2">
            <span className="inline-block h-3 w-3 rounded-full bg-[var(--copper)]" />
            <span className="text-sm">Función</span>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3">
            <p className="font-mono text-lg text-[var(--ink)]">{functionText}</p>
          </div>
        </div>

        {/* Conclusión / mensaje */}
        {results?.conclusion && (
          <div className="mt-4 rounded-xl border border-[color-mix(in_olab,var(--copper)_30%,var(--line)_70%)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/40 p-4">
            <p className="text-[var(--ink)]">{results.conclusion}</p>
          </div>
        )}

        {/* Tabla de iteraciones */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--line)]">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[var(--copper-800)] text-white">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Iteración</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">xi</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">f(xi)</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Error</th>
              </tr>
            </thead>

            <tbody>
              {iters.map((row, i) => (
                <tr
                  key={i}
                  className={
                    (i % 2 === 0
                      ? "bg-[var(--paper)]"
                      : "bg-[color-mix(in_olab,var(--paper)_92%,black_8%)]") +
                    " hover:bg-[color-mix(in_olab,var(--copper)_10%,var(--paper)_90%)] transition-colors"
                  }
                >
                  <td className="px-3 py-3 text-sm font-medium text-[var(--ink)]">{row[0]}</td>
                  <td className="px-4 py-3 text-sm text-[var(--ink)] font-mono">{row[1]}</td>
                  <td className="px-4 py-3 text-sm font-mono text-[var(--copper-800)]">{row[2]}</td>
                  <td className="px-4 py-3 text-sm font-mono text-[var(--ink)]">{row[3]}</td>
                </tr>
              ))}

              {iters.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-[var(--ink-soft)]">
                    Sin iteraciones para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Resultado final */}
        {results?.root && (
          <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--copper)] text-white grid place-items-center font-bold">
                x
              </div>
              <div>
                <p className="text-[var(--ink-soft)] text-sm">Aproximación de la raíz</p>
                <p className="font-mono text-lg font-semibold text-[var(--ink)]">{results.root}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default methodResults;
