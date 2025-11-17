import { useState } from "react";
import { ArrowLeft, HelpCircle, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MethodFormTemplate from "../biseccion/methodForm";
import MethodResults from "./methodResults";
import api from "../../../api/config";

const biseccion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    function: "x^3 - 2*x - 5",
    a: 2,
    b: 3,
    tol: 0.0000001,
    max_count: 100,
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (Number.parseFloat(formData.a) >= Number.parseFloat(formData.b)) {
        throw new Error("El extremo 'a' debe ser menor que 'b'");
      }

      const requestData = {
        function_text: formData.function,
        a: Number.parseFloat(formData.a),
        b: Number.parseFloat(formData.b),
        tol: Number.parseFloat(formData.tol),
        max_count: Number.parseInt(formData.max_count),
      };

      api
        .post("calculations/biseccion/", requestData)
        .then((response) => {
          setResults(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Ocurrió un error al calcular");
          setResults(null);
          setIsLoading(false);
        });
    } catch (err) {
      setError(err.message || "Ocurrió un error al calcular");
      setResults(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      {/* Header editorial */}
      <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </Link>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                <span className="font-editorial tracking-wide text-xl">PulsoMatematico</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[17px] font-editorial">Método de Bisección</span>
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
                Método de Bisección
              </h3>
              <p className="mt-3 text-[var(--ink-soft)]">
                Técnica robusta para hallar raíces en un intervalo donde la función cambia de signo.
              </p>
              <ul className="mt-3 space-y-1 text-[var(--ink-soft)] text-[15px]">
                <li>
                  <span className="font-medium text-[var(--copper-800)]">Funcionamiento:</span> divide [a, b] y conserva la mitad que contiene el cambio de signo.
                </li>
                <li>
                  <span className="font-medium text-[var(--copper-800)]">Requisitos:</span> f continua y f(a)·f(b) &lt; 0.
                </li>
              </ul>
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

          {/* Resultados */}
          <div>
            {results ? (
              <MethodResults results={results} methodName="Bisección" functionText={formData.function} />
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

export default biseccion;
