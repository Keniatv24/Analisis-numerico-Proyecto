import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import * as math from "mathjs"

/**
 * Componente graficador mejorado.
 * Props:
 *   - formula (string): función a graficar, por ejemplo "x^2+1"
 *   - xMin, xMax, yMin, yMax, points (opcional): valores iniciales del dominio y cantidad de puntos
 *   - editable (bool): si true, permite editar la función y el dominio
 */
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
  // Si viene una fórmula desde el estado de navegación, úsala como valor inicial
  const formulaFromState = location.state?.formula;

  // Solo toma la fórmula del state la PRIMERA vez (cuando se monta)
  const [formula, setFormula] = useState(formulaFromState || formulaProp);
  const [xMin, setXMin] = useState(xMinProp)
  const [xMax, setXMax] = useState(xMaxProp)
  const [yMin, setYMin] = useState(yMinProp)
  const [yMax, setYMax] = useState(yMaxProp)
  const [points, setPoints] = useState(pointsProp)
  const [data, setData] = useState([])
  const [error, setError] = useState("")
  const [showGrid, setShowGrid] = useState(true)
  const [showDomainModal, setShowDomainModal] = useState(false)

  // Si cambia la fórmula por props (no por navegación), actualiza el estado
  useEffect(() => {
    if (!formulaFromState) setFormula(formulaProp)
    // eslint-disable-next-line
  }, [formulaProp])

  useEffect(() => {
    calculateGraphData()
    // eslint-disable-next-line
  }, [formula, xMin, xMax, points])

  const calculateGraphData = () => {
    try {
      const min = Number.parseFloat(xMin)
      const max = Number.parseFloat(xMax)
      const pointCount = Number.parseInt(points)

      if (min >= max) {
        setError("El valor mínimo debe ser menor que el máximo")
        return
      }
      if (pointCount < 2 || pointCount > 1000) {
        setError("El número de puntos debe estar entre 2 y 1000")
        return
      }

      const step = (max - min) / (pointCount - 1)
      const newData = []

      for (let i = 0; i < pointCount; i++) {
        const x = min + i * step
        const point = { x }
        try {
          const scope = { x }
          const y = math.evaluate(formula, scope)
          if (!isNaN(y) && isFinite(y)) {
            point.y = y
          }
        } catch (e) {
          // Ignorar errores para este punto
        }
        newData.push(point)
      }

      setData(newData)
      setError("")
    } catch (e) {
      setError("Error al calcular los datos: " + e.message)
    }
  }

  const handlePlotFunction = () => {
    calculateGraphData()
  }

  const handleDefineDomain = () => {
    setShowDomainModal(true)
  }

  const handleDomainSubmit = (e) => {
    e.preventDefault()
    setShowDomainModal(false)
    calculateGraphData()
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="pt-2 px-4 sm:px-6 lg:px-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <div className="absolute inset-0 bg-teal-800 rounded-lg transform rotate-45"></div>
                <div className="absolute inset-1 bg-teal-500 rounded-md transform rotate-12"></div>
                <div className="absolute inset-2 bg-teal-400 rounded-sm transform -rotate-12"></div>
                <div className="absolute inset-3 bg-gray-800 rounded-sm"></div>
                <div className="absolute inset-4 bg-teal-600 rounded-sm transform -rotate-90"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                FRACTAL
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Panel de parámetros */}
          <div className="md:w-1/3">
            <h2 className="text-xl font-bold text-white mb-4">Parámetros</h2>
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-teal-500/50 transition-all duration-300">
              <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
              <div className="p-6">
                <div className="mb-6">
                  <label htmlFor="function" className="block text-sm font-medium text-gray-300 mb-2">
                    Función f(x)
                  </label>
                  <input
                    id="function"
                    type="text"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    disabled={!editable}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-center">
                    <label htmlFor="grid" className="block text-sm font-medium text-gray-300 mr-2">
                      Mostrar grid
                    </label>
                    <input
                      id="grid"
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="h-4 w-4 text-teal-500 focus:ring-teal-500 bg-gray-700 border-gray-600 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleDefineDomain}
                    className="w-full px-4 py-1 border border-teal-500 text-teal-400 rounded-md hover:bg-teal-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
                  >
                    Definir dominio
                  </button>
                  {editable && (
                    <button
                      onClick={handlePlotFunction}
                      className="w-full px-4 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
                    >
                      Graficar función
                    </button>
                  )}
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold text-white mb-4">Gráfico</h2>
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-teal-500/50 transition-all duration-300">
              <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
              <div className="p-4 h-[480px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    {showGrid && <CartesianGrid stroke="#374151" />}
                    <XAxis
                      dataKey="x"
                      domain={[Number.parseFloat(xMin), Number.parseFloat(xMax)]}
                      type="number"
                      label={{ value: "x", position: "insideBottomRight", offset: -5, fill: "#9CA3AF" }}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      stroke="#4B5563"
                    />
                    <YAxis
                      domain={[Number.parseFloat(yMin), Number.parseFloat(yMax)]}
                      label={{ value: "y", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      stroke="#4B5563"
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#2dd4bf"
                      dot={false}
                      isAnimationActive={false}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(value) => [value?.toFixed ? value.toFixed(4) : value, "y"]}
                      labelFormatter={(label) => `x = ${Number.parseFloat(label).toFixed(4)}`}
                      contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#F9FAFB" }}
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 w-96">
            <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Definir dominio</h3>
              <form onSubmit={handleDomainSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="xMin" className="block text-sm font-medium text-gray-300 mb-1">
                      X Min
                    </label>
                    <input
                      id="xMin"
                      type="number"
                      value={xMin}
                      onChange={(e) => setXMin(e.target.value)}
                      className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="xMax" className="block text-sm font-medium text-gray-300 mb-1">
                      X Max
                    </label>
                    <input
                      id="xMax"
                      type="number"
                      value={xMax}
                      onChange={(e) => setXMax(e.target.value)}
                      className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="yMin" className="block text-sm font-medium text-gray-300 mb-1">
                      Y Min
                    </label>
                    <input
                      id="yMin"
                      type="number"
                      value={yMin}
                      onChange={(e) => setYMin(e.target.value)}
                      className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="yMax" className="block text-sm font-medium text-gray-300 mb-1">
                      Y Max
                    </label>
                    <input
                      id="yMax"
                      type="number"
                      value={yMax}
                      onChange={(e) => setYMax(e.target.value)}
                      className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDomainModal(false)}
                    className="px-4 py-1 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                    Aplicar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}