import { useState } from "react"
import { ArrowLeft, HelpCircle, Info } from "lucide-react"
import { Link } from "react-router-dom"
import MethodFormTemplate from "../biseccion/methodForm"
import MethodResults from "./methodResults"
import api from "../../../api/config"
import { useNavigate } from "react-router-dom";

const biseccion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    function: "x^3 - 2*x - 5",
    a: 2,
    b: 3,
    tol: 0.0000001,
    max_count: 100,
  })

  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validaciones básicas
      if (Number.parseFloat(formData.a) >= Number.parseFloat(formData.b)) {
        throw new Error("El extremo 'a' debe ser menor que 'b'")
      }

      // Preparar datos para la API
      const requestData = {
        function_text: formData.function,
        a: Number.parseFloat(formData.a),
        b: Number.parseFloat(formData.b),
        tol: Number.parseFloat(formData.tol),
        max_count: Number.parseInt(formData.max_count),
      }

      console.log("Datos enviados a la API:", requestData)
      api.post('calculations/biseccion/', requestData)
        .then(response => {
          setResults(response.data);
          console.log(response.data)
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message || "Ocurrió un error al calcular");
          setResults(null);
          setIsLoading(false);
        });

    } catch (err) {
      setError(err.message || "Ocurrió un error al calcular")
      setResults(null)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center">
              <Link to="/" className="px-4 flex items-center text-teal-400 hover:text-teal-300 transition-colors mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Volver</span>
              </Link>
              <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <div className="absolute inset-0 bg-teal-800 rounded-lg transform rotate-45"></div>
                <div className="absolute inset-1 bg-teal-500 rounded-md transform rotate-12"></div>
                <div className="absolute inset-2 bg-teal-400 rounded-sm transform -rotate-12"></div>
                <div className="absolute inset-3 bg-white dark:bg-gray-800 rounded-sm"></div>
                <div className="absolute inset-4 bg-teal-600 rounded-sm transform -rotate-90"></div>
              </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  FRACTAL
                </span>
              </div>
            </div>
            <div className="text-white font-medium">Método de Bisección</div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center text-teal-400 hover:text-teal-300 transition-colors"
              >
                <Info className="h-5 w-5 mr-1" />
                <span>Info</span>
              </button>

              <button
              onClick={() => navigate("/informe")}
              className="flex items-center text-teal-400 hover:text-teal-300 transition-colors"
              >
                Ir al Informe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-gray-800/80 border-b border-gray-700 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-teal-400" />
                Método de Bisección
              </h3>
              <p className="text-gray-300 mb-4">
                El método de Bisección es una técnica para encontrar raíces de ecuaciones que
                utiliza un enfoque de división y conquista.
              </p>
              <div className="space-y-3 text-gray-400">
                <p>
                  <span className="font-medium text-teal-400">Funcionamiento:</span> Divide el intervalo [a, b]
                  en dos mitades y selecciona la submitad que contiene la raíz, repitiendo el proceso hasta
                  alcanzar la convergencia.
                </p>
                <p>
                  <span className="font-medium text-teal-400">Ventajas:</span> Converge más rápido que el método de
                  bisección mientras mantiene su robustez.
                </p>
                <p>
                  <span className="font-medium text-teal-400">Requisitos:</span> La función debe ser continua y cambiar
                  de signo en el intervalo [a, b].
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <MethodFormTemplate
                functionValue={formData.function}
                aValue={formData.a}
                bValue={formData.b}
                tolValue={formData.tol}
                maxCountValue={formData.max_count}
                onFunctionChange={(e) => handleChange({ target: { name: "function", value: e.target.value } })}
                onAChange={(e) => handleChange({ target: { name: "a", value: e.target.value } })}
                onBChange={(e) => handleChange({ target: { name: "b", value: e.target.value } })}
                onTolChange={(e) => handleChange({ target: { name: "tol", value: e.target.value } })}
                onMaxCountChange={(e) => handleChange({ target: { name: "max_count", value: e.target.value } })}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                methodName="Bisección"
                submitText="Calcular"
              />
            </div>

            {/* Results Section */}
            <div>
              {results ? (
                <MethodResults results={results} methodName="Bisección" functionText={formData.function} />
              ) : (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 flex flex-col items-center justify-center h-full">
                  <div className="h-16 w-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-teal-400"
                    >
                      <path d="M3 3v18h18" />
                      <path d="M3 15l4-4 4 4 4-4 4 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Sin resultados aún</h3>
                  <p className="text-gray-400 text-center">
                    Complete los parámetros y haga clic en "Calcular" para ver los resultados del método.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default biseccion