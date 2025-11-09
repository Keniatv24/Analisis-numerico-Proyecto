import fractalHeader from "../../../fractalHeader";

const Cell = ({ children }) => (
  <td className="px-3 py-2 border border-[var(--line)]/60 text-sm text-[var(--ink)]">{children}</td>
);

const MatrixTable = ({ title, M }) => {
  if (!Array.isArray(M) || !Array.isArray(M[0])) return null;
  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
      <div className="px-4 py-2 bg-[var(--copper)] text-white font-semibold">{title}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <tbody>
            {M.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white/60" : "bg-[var(--paper)]"}>
                {row.map((v, j) => (
                  <Cell key={j}>{Number(v).toPrecision(8)}</Cell>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VectorCard = ({ title, x }) => {
  if (!Array.isArray(x)) return null;
  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[var(--copper)] text-white grid place-items-center font-bold">x</div>
        <div>
          <p className="text-[var(--ink-soft)] text-sm">{title}</p>
          <p className="text-lg font-mono font-bold text-[var(--ink)]">
            {x.map((v) => Number(v).toExponential(8)).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

const MethodResults = ({ results }) => {
  const L  = results?.L;
  const LT = results?.LT || (Array.isArray(L) ? L[0].map((_, j) => L.map(row => row[j])) : null);
  const sol = Array.isArray(results?.solution) ? results.solution : null;

  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-card overflow-hidden">
      <div className="px-6 py-4 bg-[color-mix(in_olab,var(--copper) 78%, black 10%)] text-white">
        <fractalHeader />
        <h3 className="text-xl font-editorial">Resultados de Cholesky</h3>
      </div>

      <div className="p-4 space-y-4">
        {results?.conclusion && (
          <div className="rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/30 px-4 py-3">
            <p className="text-[var(--ink)]">{results.conclusion}</p>
          </div>
        )}

        <MatrixTable title="Matriz L" M={L} />
        <MatrixTable title="Matriz Lᵀ" M={LT} />
        {sol && <VectorCard title="Solución aproximada (si se ingresó b)" x={sol} />}
      </div>
    </div>
  );
};

export default MethodResults;
