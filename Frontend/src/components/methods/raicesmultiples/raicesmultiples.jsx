import { useState } from "react"
import { ArrowLeft, HelpCircle, Info } from "lucide-react"
import { Link } from "react-router-dom"
import MethodFormTemplate from "./methodForm"
import MethodResults from "./methodResults"
import api from "../../../api/config"
import { useNavigate } from "react-router-dom";

const raicesmultiples = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    function: "x^3 - 2*x - 5",
    firstDerivative: " 3 * x ^ 2 - 2",
    secondDerivative: "  6 * x",
    x0: 1,
    tol: 0.0000001,
    max_count: 100,
  })

  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  // Manejar cambios en los campos generales
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Manejar cambios en la función y calcular derivadas automáticamente
  const handleFunctionChange = (e) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      function: value,
    }))
    try {
      // Calcula derivadas usando mathjs
      // Importa derivative en el archivo si no está
      // import { derivative } from "mathjs"
      // eslint-disable-next-line
      const { derivative } = require("mathjs")
      const first = derivative(value, "x").toString()
      const second = derivative(first, "x").toString()
      setFormData((prev) => ({
        ...prev,
        firstDerivative: first,
        secondDerivative: second,
      }))
    } catch {
      setFormData((prev) => ({
        ...prev,
        firstDerivative: "",
        secondDerivative: "",
      }))
    }
  }

  // Permitir edición manual de la primera derivada y actualizar la segunda automáticamente
  const handleFirstDerivativeChange = (e) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      firstDerivative: value,
    }))
    try {
      // eslint-disable-next-line
      const { derivative } = require("mathjs")
      const second = derivative(value, "x").toString()
      setFormData((prev) => ({
        ...prev,
        secondDerivative: second,
      }))
    } catch {
      // No actualizar la segunda derivada si hay error
    }
  }

  // Permitir edición manual de la segunda derivada
  const handleSecondDerivativeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      secondDerivative: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validaciones básicas
      if (!formData.function) {
        throw new Error("Debe ingresar una función")
      }
      if (!formData.firstDerivative) {
        throw new Error("Debe ingresar la primera derivada")
      }
      if (!formData.secondDerivative) {
        throw new Error("Debe ingresar la segunda derivada")
      }

      // Preparar datos para la API
      const requestData = {
        function_text: formData.function,
        first_derivate_text: formData.firstDerivative,
        second_derivate_text: formData.secondDerivative,
        x0: Number.parseFloat(formData.x0),
        tol: Number.parseFloat(formData.tol),
        max_count: Number.parseInt(formData.max_count),
      }

      api.post('calculations/raicesMultiples/', requestData)
        .then(response => {
          setResults(response.data);
          setIsLoading(false);
          console.log(response.data);
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
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      {/* Header editorial */}
      <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition">
                <ArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </Link>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                <span className="font-editorial tracking-wide text-xl">PulsoMatematico</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[17px] font-editorial">Método de Raices Múltiples</span>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="inline-flex items-center gap-2 text-[var(--copper-800)] hover:text-[var(--copper)] transition"
              >
                <Info className="h-5 w-5" />
                <span>Info</span>
              </button>

              <button
                onClick={() => navigate("/informe")}
                className="book-link inline-flex items-center rounded-xl border border-[var(--line)] px-3 py-1.5 bg-[var(--card)] hover:shadow-soft transition"
              >
                Ir al Informe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Panel informativo */}
      {showInfo && (
        <div className="border-b border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-5 shadow-soft">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--copper)]" />
                Método de Raices Múltiples
              </h3>
              <p className="mt-3 text-[var(--ink-soft)]">
                El método de Raíces Múltiples es una técnica especializada que usa derivadas para manejar multiplicidad en raíces.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div>
            <MethodFormTemplate
              functionValue={formData.function}
              firstDerivative={formData.firstDerivative}
              setFirstDerivative={(val) => setFormData((prev) => ({ ...prev, firstDerivative: val }))}
              secondDerivative={formData.secondDerivative}
              setSecondDerivative={(val) => setFormData((prev) => ({ ...prev, secondDerivative: val }))}
              x0Value={formData.x0}
              tolValue={formData.tol}
              maxCountValue={formData.max_count}
              onFunctionChange={handleFunctionChange}
              onAChange={(e) => handleChange({ target: { name: "x0", value: e.target.value } })}
              onTolChange={(e) => handleChange({ target: { name: "tol", value: e.target.value } })}
              onMaxCountChange={(e) => handleChange({ target: { name: "max_count", value: e.target.value } })}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              methodName="Raices Múltiples"
              submitText="Calcular"
              // Handlers para edición manual
              handleFirstDerivativeChange={handleFirstDerivativeChange}
              handleSecondDerivativeChange={handleSecondDerivativeChange}
            />
          </div>

          {/* Resultados */}
          <div>
            {results ? (
              <MethodResults results={results} methodName="Raices Múltiples" functionText={formData.function} />
            ) : (
              <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-8 flex flex-col items-center justify-center h-full shadow-soft">
                <div className="h-16 w-16 rounded-full bg-[var(--copper-100)] grid place-items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-[var(--copper-800)]"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M3 15l4-4 4 4 4-4 4 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-editorial mb-1">Sin resultados aún</h3>
                <p className="text-[var(--ink-soft)] text-center">
                  Completa los parámetros y pulsa <strong>Calcular</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default raicesmultiples