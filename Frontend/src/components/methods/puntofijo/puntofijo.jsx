import { useState } from "react";
import { ArrowLeft, HelpCircle, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MethodFormTemplate from "./methodForm";
import MethodResults from "./methodResults";
import api from "../../../api/config";

const puntofijo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    function: "sin(x-43*10^(-3))-x",
    gfunction: "(x)*(sin(x-43*10^(-3))-x)",
    x0: 1,
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

  const handleFunctionChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, function: value }));
  };

  const handleGChange = (e) => {
    setFormData((prev) => ({ ...prev, gfunction: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!formData.function) throw new Error("Debe ingresar una función f(x)");
      if (!formData.gfunction) throw new Error("Debe ingresar una función g(x)");

      const requestData = {
        function_text: formData.function,
        gfunction_text: formData.gfunction,
        x0: Number.parseFloat(formData.x0),
        tol: Number.parseFloat(formData.tol),
        max_count: Number.parseInt(formData.max_count),
      };

      api
        .post("calculations/puntoFijo/", requestData)
        .then((response) => {
          setResults(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.response?.data?.error || err.message || "Ocurrió un error al calcular");
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
              <Link to="/" className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition">
                <ArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </Link>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                <span className="font-editorial tracking-wide text-xl">PulsoMatematico</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[17px] font-editorial">Método de Punto Fijo</span>
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

      {showInfo && (
        <div className="border-b border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-5 shadow-soft">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--copper)]" />
                Método de Punto Fijo
              </h3>
              <p className="mt-3 text-[var(--ink-soft)]">
                El método de Punto Fijo reescribe la ecuación en la forma x = g(x) y genera una sucesión que converge a la raíz.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <MethodFormTemplate
              functionValue={formData.function}
              gValue={formData.gfunction}
              setGValue={(val) => setFormData((prev) => ({ ...prev, gfunction: val }))}
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
              methodName="Punto Fijo"
              submitText="Calcular"
            />
          </div>

          <div>
            {results ? (
              <MethodResults results={results} methodName="Punto Fijo" functionText={formData.function} />
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

export default puntofijo;