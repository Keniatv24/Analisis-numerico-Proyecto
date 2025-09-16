import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as math from "mathjs";

export default function FunctionGrapher({
  formula: formulaProp = "x^2",
  xMin: xMinProp = -6,
  xMax: xMaxProp = 6,
  yMin: yMinProp = -4,
  yMax: yMaxProp = 4,
  points: pointsProp = 100,
  editable = true,
}) {
  const location = useLocation();
  const formulaFromState = location.state?.formula;

  const [formula, setFormula] = useState(formulaFromState || formulaProp);
  const [xMin, setXMin] = useState(xMinProp);
  const [xMax, setXMax] = useState(xMaxProp);
  const [yMin, setYMin] = useState(yMinProp);
  const [yMax, setYMax] = useState(yMaxProp);
  const [points, setPoints] = useState(pointsProp);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [showGrid, setShowGrid] = useState(true);
  const [showDomainModal, setShowDomainModal] = useState(false);

  useEffect(() => {
    if (!formulaFromState) setFormula(formulaProp);
    // eslint-disable-next-line
  }, [formulaProp]);

  useEffect(() => {
    calculateGraphData();
    // eslint-disable-next-line
  }, [formula, xMin, xMax, points]);

  const calculateGraphData = () => {
    try {
      const min = Number.parseFloat(xMin);
      const max = Number.parseFloat(xMax);
      const pointCount = Number.parseInt(points);

      if (min >= max) {
        setError("El valor mínimo debe ser menor que el máximo");
        return;
      }
      if (pointCount < 2 || pointCount > 1000) {
        setError("El número de puntos debe estar entre 2 y 1000");
        return;
      }

      const step = (max - min) / (pointCount - 1);
      const newData = [];

      for (let i = 0; i < pointCount; i++) {
        const x = min + i * step;
        const point = { x };
        try {
          const scope = { x };
          const y = math.evaluate(formula, scope);
          if (!isNaN(y) && isFinite(y)) {
            point.y = y;
          }
        } catch (e) {
          /* ignore point error */
        }
        newData.push(point);
      }

      setData(newData);
      setError("");
    } catch (e) {
      setError("Error al calcular los datos: " + e.message);
    }
  };

  const handlePlotFunction = () => {
    calculateGraphData();
  };

  const handleDefineDomain = () => {
    setShowDomainModal(true);
  };

  const handleDomainSubmit = (e) => {
    e.preventDefault();
    setShowDomainModal(false);
    calculateGraphData();
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header editorial */}
        <header className="px-4 sm:px-6 lg:px-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)] shadow-soft">
              <span className="font-editorial tracking-wide text-xl">PulsoMatematico</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Panel de parámetros */}
          <div className="md:w-1/3">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] overflow-hidden shadow-soft">
              {/* Banda cobre */}
              <div className="h-2 w-full bg-[var(--copper)]" />
              <div className="p-6">
                <h2 className="font-editorial text-xl mb-4">Parámetros</h2>

                <div className="mb-6">
                  <label htmlFor="function" className="block text-sm font-medium mb-2">
                    Función f(x)
                  </label>
                  <div className="relative">
                    <input
                      id="function"
                      type="text"
                      value={formula}
                      onChange={(e) => setFormula(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-[var(--line)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--copper)] shadow-soft pl-12 disabled:opacity-70"
                      disabled={!editable}
                      placeholder="x^3 - 2*x - 5"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 grid place-items-center pointer-events-none">
                      <span className="text-[var(--ink-soft)] text-sm">f(x)=</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="grid" className="inline-flex items-center gap-2 text-sm">
                    <input
                      id="grid"
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--line)]"
                    />
                    Mostrar grilla
                  </label>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleDefineDomain}
                    className="w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-2 hover:shadow-soft transition"
                  >
                    Definir dominio
                  </button>
                  {editable && (
                    <button
                      onClick={handlePlotFunction}
                      className="w-full btn-copper rounded-2xl px-4 py-2 shadow-card hover:shadow-lg transition"
                    >
                      Graficar función
                    </button>
                  )}
                </div>

                {error && (
                  <p className="mt-4 text-sm rounded-xl border border-[var(--line)] bg-[color-mix(in_olab,red 14%,var(--paper) 86%)]/35 px-3 py-2">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="md:w-2/3">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] overflow-hidden shadow-soft">
              <div className="h-2 w-full bg-[var(--copper)]" />
              <div className="p-4 h-[480px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    {showGrid && <CartesianGrid stroke="color-mix(in oklab, var(--ink) 18%, transparent)" />}
                    <XAxis
                      dataKey="x"
                      domain={[Number.parseFloat(xMin), Number.parseFloat(xMax)]}
                      type="number"
                      label={{ value: "x", position: "insideBottomRight", offset: -5, fill: "color-mix(in oklab, var(--ink) 60%, transparent)" }}
                      tick={{ fill: "color-mix(in oklab, var(--ink) 60%, transparent)", fontSize: 12 }}
                      stroke="color-mix(in oklab, var(--ink) 35%, transparent)"
                    />
                    <YAxis
                      domain={[Number.parseFloat(yMin), Number.parseFloat(yMax)]}
                      label={{ value: "y", angle: -90, position: "insideLeft", fill: "color-mix(in oklab, var(--ink) 60%, transparent)" }}
                      tick={{ fill: "color-mix(in oklab, var(--ink) 60%, transparent)", fontSize: 12 }}
                      stroke="color-mix(in oklab, var(--ink) 35%, transparent)"
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="var(--copper)"
                      dot={false}
                      isAnimationActive={false}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(value) => [value?.toFixed ? value.toFixed(4) : value, "y"]}
                      labelFormatter={(label) => `x = ${Number.parseFloat(label).toFixed(4)}`}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                        borderRadius: "12px",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para definir dominio */}
      {showDomainModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm grid place-items-center z-50 p-4">
          <div className="w-full max-w-md rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
            <div className="h-2 w-full bg-[var(--copper)]" />
            <div className="p-6">
              <h3 className="font-editorial text-lg mb-4">Definir dominio</h3>
              <form onSubmit={handleDomainSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="xMin" className="block text-sm font-medium mb-1">
                      X Min
                    </label>
                    <input
                      id="xMin"
                      type="number"
                      value={xMin}
                      onChange={(e) => setXMin(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[var(--line)] rounded-xl shadow-soft"
                    />
                  </div>
                  <div>
                    <label htmlFor="xMax" className="block text-sm font-medium mb-1">
                      X Max
                    </label>
                    <input
                      id="xMax"
                      type="number"
                      value={xMax}
                      onChange={(e) => setXMax(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[var(--line)] rounded-xl shadow-soft"
                    />
                  </div>
                  <div>
                    <label htmlFor="yMin" className="block text-sm font-medium mb-1">
                      Y Min
                    </label>
                    <input
                      id="yMin"
                      type="number"
                      value={yMin}
                      onChange={(e) => setYMin(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[var(--line)] rounded-xl shadow-soft"
                    />
                  </div>
                  <div>
                    <label htmlFor="yMax" className="block text-sm font-medium mb-1">
                      Y Max
                    </label>
                    <input
                      id="yMax"
                      type="number"
                      value={yMax}
                      onChange={(e) => setYMax(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[var(--line)] rounded-xl shadow-soft"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDomainModal(false)}
                    className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-2 hover:shadow-soft transition"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-copper rounded-2xl px-4 py-2 shadow-card hover:shadow-lg transition">
                    Aplicar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
