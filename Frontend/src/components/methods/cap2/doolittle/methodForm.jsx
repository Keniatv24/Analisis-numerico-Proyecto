import fractalHeader from "../../../fractalHeader";
import { Calculator } from "lucide-react";

const methodForm = ({
  n,
  matrixA,
  vectorB,
  onNChange,
  onMatrixAChange,
  onVectorBChange,
  onSubmit,
  isLoading = false,
  error = null,
  submitText = "Calcular",
  methodName = "Doolittle",
}) => {
  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
      <div className="px-6 py-4">
        <fractalHeader />
        <div className="mt-2 rounded-t-xxl h-2 w-full bg-[var(--copper)]" />
        <h2 className="mt-3 text-xl font-editorial">Método {methodName}</h2>
        <p className="text-[var(--ink-soft)] text-sm">Complete los siguientes parámetros</p>
      </div>

      <div className="px-6 pb-6">
        <div className="mb-5 p-4 rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/25">
          <p className="text-sm text-[var(--ink-soft)]">
            Doolittle: <strong>diag(L)=1</strong> y <strong>U</strong> con diagonal libre. Si un pivote de U es 0, cambie a “LU con pivoteo”.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Tamaño */}
          <div>
            <label className="block text-sm font-medium mb-2">Tamaño de la matriz (n×n)</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => onNChange(n - 1)} disabled={n <= 2} className="w-8 h-8 bg-[var(--card)] border border-[var(--line)] rounded-lg flex items-center justify-center disabled:opacity-50">-</button>
              <div className="bg-[var(--paper)] px-4 py-1 rounded-lg">
                <span className="font-mono text-lg">{n}×{n}</span>
              </div>
              <button type="button" onClick={() => onNChange(n + 1)} disabled={n >= 10} className="w-8 h-8 bg-[var(--card)] border border-[var(--line)] rounded-lg flex items-center justify-center disabled:opacity-50">+</button>
            </div>
          </div>

          {/* Matriz A */}
          <div>
            <label className="block text-sm font-medium mb-2">Matriz de coeficientes A</label>
            <div className="bg-[var(--paper)] p-4 rounded-lg border border-[var(--line)]">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
                {matrixA.map((row, i) =>
                  row.map((value, j) => (
                    <input
                      key={`a-${i}-${j}`}
                      type="number"
                      value={value === "" ? "" : value}
                      onChange={(e) => {
                        const val = e.target.value;
                        onMatrixAChange(i, j, val === "" ? "" : Number(val));
                      }}
                      className="w-full px-2 py-1 bg-white border border-[var(--line)] rounded text-[var(--ink)] text-center focus:ring-2 focus:ring-[var(--copper)] transition-all"
                      step="0.1"
                      required
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Vector b */}
          <div>
            <label className="block text-sm font-medium mb-2">Vector de términos independientes b</label>
            <div className="bg-[var(--paper)] p-4 rounded-lg border border-[var(--line)]">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
                {vectorB.map((value, i) => (
                  <input
                    key={`b-${i}`}
                    type="number"
                    value={value === "" ? "" : value}
                    onChange={(e) => {
                      const val = e.target.value;
                      onVectorBChange(i, val === "" ? "" : Number(val));
                    }}
                    className="w-full px-2 py-1 bg-white border border-[var(--line)] rounded text-[var(--ink)] text-center focus:ring-2 focus:ring-[var(--copper)] transition-all"
                    step="0.1"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 btn-copper rounded-2xl shadow-card hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed inline-flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  {submitText}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 p-4 rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,red 14%,var(--paper) 86%)]/35 text-[color-mix(in_olab,red 46%,black 54%)]">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default methodForm;
