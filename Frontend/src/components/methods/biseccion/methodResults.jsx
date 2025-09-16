import fractalHeader from "../../fractalHeader";

const methodResults = ({ results, methodName, functionText }) => {
  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
      {/* Banda cobre superior */}
      <div className="px-6 py-4">
        <fractalHeader />
        <div className="mt-2 rounded-t-xxl h-2 w-full bg-[var(--copper)]" />
        <h3 className="mt-3 text-xl font-editorial">Resultados del Método {methodName}</h3>
      </div>

      <div className="px-6 pb-6">
        {/* Función */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full bg-[var(--copper)]" />
            <h4 className="text-sm text-[var(--ink-soft)]">Función:</h4>
          </div>
          <div className="bg-white rounded-xl p-3 border border-[var(--line)] shadow-soft">
            <p className="text-lg font-mono">{functionText}</p>
          </div>
        </div>

        {/* Conclusión */}
        {results.conclusion && (
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/30 mb-6">
            <p className="text-[var(--ink)]">{results.conclusion}</p>
          </div>
        )}

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl border border-[var(--line)] shadow-soft">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--copper-700)] text-white">
              <tr>
                <th className="px-4 py-3 text-left uppercase tracking-wide">Iteración</th>
                <th className="px-4 py-3 text-left uppercase tracking-wide">a</th>
                <th className="px-4 py-3 text-left uppercase tracking-wide">xm</th>
                <th className="px-4 py-3 text-left uppercase tracking-wide">b</th>
                <th className="px-4 py-3 text-left uppercase tracking-wide">f(xm)</th>
                <th className="px-4 py-3 text-left uppercase tracking-wide">Error</th>
              </tr>
            </thead>
            <tbody>
              {results.iterations.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[var(--card)]" : "bg-white"}
                >
                  <td className="px-3 py-3 font-medium">{row[0]}</td>
                  <td className="px-3 py-3 font-mono">{row[1]}</td>
                  <td className="px-3 py-3 font-mono text-[var(--copper-900)] font-semibold">{row[2]}</td>
                  <td className="px-3 py-3 font-mono">{row[3]}</td>
                  <td className="px-3 py-3 font-mono">{row[4]}</td>
                  <td className="px-3 py-3 font-mono">{row[5] || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resultado final */}
        {results.root && (
          <div className="mt-6 p-4 rounded-xl border border-[var(--line)] bg-[var(--card)]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--copper)] text-white grid place-items-center font-bold">
                x
              </div>
              <div>
                <p className="text-sm text-[var(--ink-soft)]">Aproximación de la raíz:</p>
                <p className="text-lg font-mono font-bold">{results.root}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default methodResults;
