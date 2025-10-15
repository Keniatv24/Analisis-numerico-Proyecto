import fractalHeader from "../../fractalHeader";
import { useState } from "react";
import Algebrite from "algebrite";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const getGSuggestions = (fStr) => {
  const x = "x";
  const basicas = [
    { desc: "g(x) = x + f(x)", expr: `(${x}) + (${fStr})` },
    { desc: "g(x) = x - f(x)", expr: `(${x}) - (${fStr})` },
    { desc: "g(x) = x + k·f(x)", expr: `(${x}) + k*(${fStr})` },
    { desc: "g(x) = x·f(x)", expr: `(${x})*(${fStr})` },
    { desc: "g(x) = x/f(x)", expr: `(${x})/(${fStr})` },
  ];

  let simplificaciones = [];
  try {
    const simp = Algebrite.run(`simplify((${fStr}) + (${x}))`);
    simplificaciones = [{ desc: "g(x) = Simplificación de f(x) + x", expr: simp }];
  } catch {
    simplificaciones = [{ desc: "g(x) = Simplificación de f(x) + x", expr: `simplify((${fStr}) + (${x}))` }];
  }

  let algebraicas = [];
  try {
    const sol = Algebrite.run(`roots((${fStr}), ${x})`);
    const matches = sol.match(/\[([^\]]*)\]/);
    if (matches && matches[1].trim() !== "") {
      const sols = matches[1].split(",").map((s) => s.trim());
      algebraicas = sols.map((expr, i) => ({ desc: `Solución algebraica ${i + 1}`, expr }));
    } else {
      algebraicas = [{ desc: "Solución algebraica", expr: "No se encontraron soluciones" }];
    }
  } catch {
    algebraicas = [{ desc: "Solución algebraica", expr: "No se pudo resolver en frontend" }];
  }

  return [...basicas, ...simplificaciones, ...algebraicas];
};

const methodFormTemplate = ({
  functionValue,
  gValue,
  setGValue,
  x0Value,
  tolValue,
  maxCountValue,
  onFunctionChange,
  onAChange,
  onTolChange,
  onMaxCountChange,
  onSubmit,
  isLoading = false,
  error = null,
  submitText = "Calcular",
  methodName = "Numérico",
}) => {
  const [showGHelp, setShowGHelp] = useState(false);
  const [gSuggestions, setGSuggestions] = useState([]);

  const handleShowGSuggestions = () => {
    if (!showGHelp && functionValue) {
      setGSuggestions(getGSuggestions(functionValue));
    }
    setShowGHelp(!showGHelp);
  };

  const navigate = useNavigate();

  const handleGraphClick = useCallback(() => {
    navigate("/graficador", { state: { formula: functionValue } });
  }, [navigate, functionValue]);

  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
      {/* Cabecera cobre */}
      <div className="px-6 py-4">
        <fractalHeader />
        <div className="mt-2 rounded-t-xxl h-2 w-full bg-[var(--copper)]" />
        <h2 className="mt-3 text-xl font-editorial">Método {methodName}</h2>
        <p className="text-[var(--ink-soft)] text-sm">Complete los siguientes parámetros</p>
      </div>

      <div className="px-6 pb-6">
        <div className="mb-5 p-4 rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/25">
          <p className="text-sm text-[var(--ink-soft)]">
            Asegúrate de que la función sea continua en el intervalo. Puedes
            <span
              className="text-[var(--copper-900)] font-medium hover:underline cursor-pointer"
              onClick={handleGraphClick}
              tabIndex={0}
              role="button"
            >
              {" "}graficar la función
            </span>
            .
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Función */}
          <div className="space-y-2">
            <label htmlFor="function" className="block text-sm font-medium">
              Función f(x)
            </label>
            <div className="relative">
              <input
                id="function"
                type="text"
                name="function"
                value={functionValue}
                onChange={onFunctionChange}
                className="w-full px-4 py-2 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] transition shadow-soft pl-12"
                placeholder="x³ - 2x - 5"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 grid place-items-center pointer-events-none">
                <span className="text-[var(--ink-soft)] text-sm">f(x)=</span>
              </div>
            </div>
          </div>

          {/* g(x) */}
          <div className="space-y-2">
            <label htmlFor="gx" className="block text-sm font-medium flex items-center justify-between">
              <span>Función g(x)</span>
              <button
                type="button"
                className="text-[var(--copper-900)] hover:text-[var(--copper-600)] text-xs"
                onClick={handleShowGSuggestions}
              >
                Ver sugerencias
              </button>
            </label>
            <div className="relative">
              <input
                id="gx"
                type="text"
                name="g"
                value={gValue}
                onChange={(e) => setGValue(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] transition shadow-soft pl-12"
                placeholder="Ej: (2x + 5)^(1/3)"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 grid place-items-center pointer-events-none">
                <span className="text-[var(--ink-soft)] text-sm">g(x)=</span>
              </div>
            </div>
            {showGHelp && (
              <div className="mt-2 p-3 rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,var(--paper)_88%,var(--copper)_12%)]/20 text-sm max-h-56 overflow-y-auto">
                <div className="font-semibold mb-2">Sugerencias para g(x):</div>
                <ul className="list-disc pl-5 space-y-1">
                  {gSuggestions.map((g, idx) => (
                    <li
                      key={idx}
                      className="cursor-pointer hover:text-[var(--copper-800)]"
                      onClick={() => {
                        setGValue(g.expr);
                        setShowGHelp(false);
                      }}
                    >
                      <span className="font-bold">{g.desc}:</span> <span>{g.expr}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--ink-soft)] mt-2">Haz clic en una sugerencia para usarla.</div>
              </div>
            )}
          </div>

          {/* x0 */}
          <div className="space-y-2">
            <label htmlFor="x0" className="block text-sm font-medium">
              Valor inicial x0
            </label>
            <input
              id="x0"
              type="number"
              name="x0"
              value={x0Value}
              onChange={onAChange}
              className="w-full px-4 py-2 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] transition shadow-soft"
              step="0.1"
              required
            />
          </div>

          {/* tol / max */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="tolerancia" className="block text-sm font-medium">
                Tolerancia
              </label>
              <input
                id="tolerancia"
                type="number"
                name="tol"
                value={tolValue}
                onChange={onTolChange}
                className="w-full px-4 py-2 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] transition shadow-soft"
                step="0.0001"
                max="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="max-iteraciones" className="block text-sm font-medium">
                Iteraciones máx.
              </label>
              <input
                id="max-iteraciones"
                type="number"
                name="maxCount"
                value={maxCountValue}
                onChange={onMaxCountChange}
                className="w-full px-4 py-2 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] transition shadow-soft"
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,red 14%,var(--paper) 86%)]/35 text-[color-mix(in_olab,red 46%,black 54%)]">
              <p className="text-sm">{error}</p>
            </div>
          )}

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
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01" />
                  </svg>
                  {submitText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default methodFormTemplate;