import FractalHeader from "../../../FractalHeader";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

const methodForm = ({
  n,
  matrixA,
  vectorB,
  vectorX0,
  norm,
  tol,
  maxIterations,
  onNChange,
  onMatrixAChange,
  onVectorBChange,
  onVectorX0Change,
  onNormChange,
  onTolChange,
  onMaxIterationsChange,
  onSubmit,
  isLoading = false,
  error = null,
  submitText = "Calcular",
  methodName = "Gauss Seidel",
}) => {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-4">
        <FractalHeader />
        <h2 className="text-xl font-bold text-white text-center">Método {methodName}</h2>
        <p className="text-teal-100 mt-1 text-sm text-center">Complete los siguientes parámetros</p>
      </div>

      <div className="p-3.5">
        <div className="py-2 mb-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border-l-4 border-teal-500">
          <p className="text-sm text-teal-800 dark:text-teal-200">
            Asegúrese de que la matriz sea diagonalmente dominante para garantizar la convergencia del método.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Tamaño de matriz */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tamaño de la matriz (n×n)
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onNChange(n - 1)}
                disabled={n <= 2}
                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-white rounded-lg flex items-center justify-center transition-colors"
              >-</button>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-1 rounded-lg">
                <span className="text-gray-700 dark:text-white font-mono text-lg">
                  {n}×{n}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNChange(n + 1)}
                disabled={n >= 10}
                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-white rounded-lg flex items-center justify-center transition-colors"
              >+</button>
            </div>
          </div>

          {/* Matriz A */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Matriz de coeficientes A
            </label>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
                {matrixA.map((row, i) =>
                  row.map((value, j) => (
                    <input
                      key={`a-${i}-${j}`}
                      type="number"
                      value={value === "" ? "" : value}
                      onChange={(e) => {
                        // Permitir campo vacío (""), 0, o cualquier número
                        const val = e.target.value;
                        onMatrixAChange(i, j, val === "" ? "" : Number(val));
                      }}
                      className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vector de términos independientes b
            </label>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
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
                    className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    step="0.1"
                    required
                  />
                ))}
              </div>
              <div className="text-center mt-2">
              </div>
            </div>
          </div>

          {/* Vector x0 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vector inicial x₀
            </label>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
                {vectorX0.map((value, i) => (
                  <input
                    key={`x0-${i}`}
                    type="number"
                    value={value === "" ? "" : value}
                    onChange={(e) => {
                      const val = e.target.value;
                      onVectorX0Change(i, val === "" ? "" : Number(val));
                    }}
                    className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    step="0.1"
                  />
                ))}
              </div>
              <div className="text-center mt-2">
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Norma</label>
              <select
                value={norm}
                onChange={onNormChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              >
                <option value="1">Norma 1 (Manhattan)</option>
                <option value="2">Norma 2 (Euclidiana)</option>
                <option value="inf">Norma ∞ (Máximo)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tolerancia</label>
              <input
                type="text"
                value={tol}
                onChange={onTolChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Iteraciones máx.</label>
              <input
                type="number"
                value={maxIterations}
                onChange={onMaxIterationsChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border-l-4 border-red-500 text-red-700 dark:text-red-400 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500 dark:text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default methodForm;