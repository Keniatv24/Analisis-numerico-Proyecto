"use client"
import FractalHeader from "../../FractalHeader"
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const methodFormTemplate = ({
  functionValue,
  aValue,
  bValue,
  tolValue,
  maxCountValue,
  onFunctionChange,
  onAChange,
  onBChange,
  onTolChange,
  onMaxCountChange,
  onSubmit,
  isLoading = false,
  error = null,
  submitText = "Calcular",
  methodName = "Numérico",
}) => {

  const navigate = useNavigate();

  // Usar useCallback para evitar problemas de cierre sobre functionValue
  const handleGraphClick = useCallback(() => {
    navigate("/graficador", { state: { formula: functionValue } });
  }, [navigate, functionValue]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-4">
        <FractalHeader />
        <h2 className="text-xl font-bold text-white text-center">Método {methodName}</h2>
        <p className="text-teal-100 mt-1 text-sm text-center">Complete los siguientes parámetros</p>
      </div>

      <div className="p-3.5">
        <div className="mb-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border-l-4 border-teal-500">
          <p className="text-sm text-teal-800 dark:text-teal-200">
            Asegúrese de que la función sea continua en el intervalo dado. Para verificar, puede
            <span
              className="text-teal-600 dark:text-teal-300 font-medium hover:underline cursor-pointer"
              onClick={handleGraphClick}
              tabIndex={0}
              role="button"
            >
              {" "} graficar la función
            </span>
            .
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Input de función */}
          <div className="space-y-2">
            <label htmlFor="function" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Función f(x)
            </label>
            <div className="relative">
              <input
                id="function"
                type="text"
                name="function"
                value={functionValue}
                onChange={onFunctionChange}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm text-gray-900 dark:text-white pl-10"
                placeholder="x³ - 2x - 5"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-sm">f(x)=</span>
              </div>
            </div>
          </div>

          {/* Grupo de inputs */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="extremo-a" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Extremo a
              </label>
              <input
                id="extremo-a"
                type="number"
                name="a"
                value={aValue}
                onChange={onAChange}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm text-gray-900 dark:text-white"
                step="0.1"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="extremo-b" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Extremo b
              </label>
              <input
                id="extremo-b"
                type="number"
                name="b"
                value={bValue}
                onChange={onBChange}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm text-gray-900 dark:text-white"
                step="0.1"
                required
              />
            </div>
          </div>

          {/* Grupo de configuración */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="tolerancia" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tolerancia
              </label>
              <input
                id="tolerancia"
                type="number"
                name="tol"
                value={tolValue}
                onChange={onTolChange}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm text-gray-900 dark:text-white"
                step="0.0001"
                max="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="max-iteraciones" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Iteraciones máx.
              </label>
              <input
                id="max-iteraciones"
                type="number"
                name="maxCount"
                value={maxCountValue}
                onChange={onMaxCountChange}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border-l-4 border-red-500 text-red-700 dark:text-red-400">
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
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  {submitText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default methodFormTemplate