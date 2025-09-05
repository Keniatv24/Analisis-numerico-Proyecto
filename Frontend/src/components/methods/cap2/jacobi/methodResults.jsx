import FractalHeader from "../../../FractalHeader";

const methodResults = ({ results, methodName }) => {
  // Manejo seguro de datos faltantes
  const spectralRadius =
    results.spectral_radius !== undefined && results.spectral_radius !== null
      ? Number(results.spectral_radius).toFixed(5)
      : "N/A";

  // Iteraciones: cada item es (iteracion, error, x)
  const iterations = Array.isArray(results.iterations) ? results.iterations : [];

  // Solución final
  const solution =
    Array.isArray(results.final_solution) && results.final_solution.length > 0
      ? results.final_solution
      : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-4">
        <FractalHeader />
        <h3 className="text-xl font-bold text-white text-center">Resultados del Método {methodName}</h3>
      </div>

      <div className="p-3 ">
        <div className="py-1 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Radio espectral:</strong> {spectralRadius}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Convergencia:</strong>{" "}
            {results.spectral_radius !== undefined && results.spectral_radius !== null
              ? results.spectral_radius < 1
                ? "Puede converger"
                : "No converge"
              : "N/A"}
          </p>
        </div>

        {results.conclusion && (
          <div className="py-1 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg mb-6 border-l-4 border-teal-500">
            <p className="text-teal-800 dark:text-teal-200">{results.conclusion}</p>
          </div>
        )}

        {iterations.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-teal-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Iteración</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Error</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">X</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {iterations.map(([iter, error, x], index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700/50"}>
                    <td className="px-2 py-3 text-sm font-medium text-gray-900 dark:text-white">{iter}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                      {typeof error === "number" ? error.toExponential(5) : ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                      {Array.isArray(x) ? x.map((v) => Number(v).toExponential(5)).join(", ") : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {solution && (
          <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold mr-3">
                x
              </div>
              <div>
                <p className="text-sm text-teal-800 dark:text-teal-200">Solución aproximada:</p>
                <p className="text-lg font-mono font-bold text-teal-800 dark:text-teal-200">
                  {solution.map((v) => Number(v).toExponential(8)).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default methodResults;