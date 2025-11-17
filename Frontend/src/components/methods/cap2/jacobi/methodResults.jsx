import fractalHeader from "../../../fractalHeader";

const methodResults = ({ results, methodName = "Jacobi" }) => {
  const spectralRadius =
    results?.spectral_radius !== undefined && results?.spectral_radius !== null
      ? Number(results.spectral_radius).toFixed(5)
      : "N/A";

  // Iteraciones: cada item es [iter, error, x]
  const iterations = Array.isArray(results?.iterations) ? results.iterations : [];

  // Solución final
  const solution =
    Array.isArray(results?.final_solution) && results.final_solution.length > 0
      ? results.final_solution
      : null;

  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
      {/* Header editorial */}
      <div className="px-6 pt-4">
        <fractalHeader />
        <div className="mt-2 h-2 w-full rounded-t-xxl bg-[var(--copper)]" />
        <h3 className="mt-3 text-xl font-editorial text-[var(--ink)] text-center">
          Resultados — {methodName}
        </h3>
      </div>

      <div className="px-6 pb-6">
        {/* Resumen espectral */}
        <div className="py-1 mb-4">
          <p className="text-sm text-[var(--ink)]">
            <strong>Radio espectral:</strong> {spectralRadius}
          </p>
          <p className="text-sm text-[var(--ink)]">
            <strong>Convergencia:</strong>{" "}
            {results?.spectral_radius !== undefined && results?.spectral_radius !== null
              ? results.spectral_radius < 1
                ? "Puede converger"
                : "No converge"
              : "N/A"}
          </p>
        </div>

        {/* Conclusión */}
        {results?.conclusion && (
          <div className="py-1 p-4 rounded-xl border border-[color-mix(in_olab,var(--copper)_30%,var(--line)_70%)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/40 mb-6">
            <p className="text-[var(--ink)]">{results.conclusion}</p>
          </div>
        )}

        {/* Tabla de iteraciones */}
        {iterations.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-[var(--line)] shadow-soft">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[var(--copper-800)] text-white">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Iteración</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Error</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">x</th>
                </tr>
              </thead>
              <tbody>
                {iterations.map(([iter, error, x], index) => (
                  <tr
                    key={index}
                    className={
                      (index % 2 === 0
                        ? "bg-[var(--paper)]"
                        : "bg-[color-mix(in_olab,var(--paper)_92%,black_8%)]") +
                      " hover:bg-[color-mix(in_olab,var(--copper)_10%,var(--paper)_90%)] transition-colors"
                    }
                  >
                    <td className="px-3 py-3 text-sm font-medium text-[var(--ink)]">{iter}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[var(--ink)]">
                      {typeof error === "number" ? error.toExponential(5) : ""}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-[var(--ink)]">
                      {Array.isArray(x) ? x.map((v) => Number(v).toExponential(5)).join(", ") : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Solución final */}
        {solution && (
          <div className="mt-6 p-4 rounded-xl border border-[var(--line)] bg-[var(--paper)]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--copper)] text-white grid place-items-center font-bold">
                x
              </div>
              <div>
                <p className="text-[var(--ink-soft)] text-sm">Solución aproximada</p>
                <p className="text-lg font-mono font-semibold text-[var(--ink)]">
                  {solution.map((v) => Number(v).toExponential(8)).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vacío */}
        {!solution && iterations.length === 0 && (
          <div className="mt-4 text-center text-sm text-[var(--ink-soft)]">
            Sin resultados aún. Ejecuta el método para ver el detalle.
          </div>
        )}
      </div>
    </div>
  );
};

export default methodResults;
