  import { Link } from 'react-router-dom'

function home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <header className="pt-2 px-4 sm:px-6 lg:px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <div className="absolute inset-0 bg-teal-800 rounded-lg transform rotate-45"></div>
                <div className="absolute inset-1 bg-teal-500 rounded-md transform rotate-12"></div>
                <div className="absolute inset-2 bg-teal-400 rounded-sm transform -rotate-12"></div>
                <div className="absolute inset-3 bg-white dark:bg-gray-800 rounded-sm"></div>
                <div className="absolute inset-4 bg-teal-600 rounded-sm transform -rotate-90"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                FRACTAL
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-3.5 px-4 sm:px-6 lg:px-8">
        <div className=" mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            <span className="font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">FRACTAL</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Plataforma avanzada de métodos numéricos
          </p>
        </div>
      </section>

      {/* Methods Section */}
      <section id="metodos" className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className=" mx-auto">
          <div className="text-center mb-16">
            <h2 className="py-4 text-3xl md:text-4xl font-bold text-white mb-4">Métodos Numéricos</h2>
          </div>

          {/* Capítulo 1 */}
          <h3 className="text-left text-2xl font-bold text-white mb-4">Capítulo 1</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Método 1 */}
            <Link to="/metodos/biseccion" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-teal-400">
                      {/* Eje X */}
                      <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1.5" />
                      {/* Eje Y */}
                      <line x1="12" y1="2" x2="12" y2="22" strokeWidth="1.5" />
                      {/* Curva de función */}
                      <path d="M2,18 Q7,0 12,12 Q17,24 22,6" strokeWidth="1.5" fill="none" />
                      {/* Línea de bisección */}
                      <line x1="7" y1="4" x2="17" y2="20" strokeWidth="1.5" strokeDasharray="2 1" />
                      {/* Punto medio */}
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                    </div>
                    <h3 className="px-2 text-xl font-bold text-white">Bisección</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Divide repetidamente el intervalo a la mitad y selecciona el subintervalo donde ocurre el cambio de
                    signo.
                  </p>
                  <div className="flex items-center text-teal-400 group-hover:text-teal-300">
                    <span>Explorar método</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Método 2 */}
            <Link to="/metodos/regla-falsa" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-teal-400">
                        {/* Eje X */}
                        <line x1="2" y1="18" x2="22" y2="18" strokeWidth="1.5" />
                        {/* Curva de función */}
                        <path d="M2,14 Q8,4 14,16 Q18,24 22,8" strokeWidth="1.5" fill="none" />
                        {/* Puntos a y b */}
                        <circle cx="4" cy="14" r="1.5" fill="currentColor" />
                        <circle cx="20" cy="10" r="1.5" fill="currentColor" />
                        {/* Línea secante */}
                        <line x1="4" y1="14" x2="20" y2="10" strokeWidth="1.5" />
                        {/* Punto de intersección con eje X */}
                        <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                        {/* Línea vertical desde intersección */}
                        <line x1="12" y1="18" x2="12" y2="15" strokeWidth="1" strokeDasharray="2 1" />
                      </svg>
                    </div>
                    <h3 className="px-2 text-xl font-bold text-white">Regla Falsa</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Utiliza interpolación lineal para estimar la raíz, combinando la robustez de la bisección con mayor
                    velocidad.
                  </p>
                  <div className="flex items-center text-teal-400 group-hover:text-teal-300">
                    <span>Explorar método</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Método 3 */}
            <Link to="/metodos/secante" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-teal-400">
                        {/* Ejes de coordenadas */}
                        <line x1="2" y1="18" x2="22" y2="18" strokeWidth="1.5" />
                        <line x1="4" y1="2" x2="4" y2="22" strokeWidth="1.5" />

                        {/* Curva de la función */}
                        <path d="M2,14 Q7,6 12,14 Q17,22 22,10" strokeWidth="1.5" />

                        {/* Puntos x₀ y x₁ en la curva */}
                        <circle cx="7" cy="10" r="1.5" fill="#2dd4bf" />
                        <circle cx="17" cy="16" r="1.5" fill="#2dd4bf" />

                        {/* Línea secante entre los dos puntos */}
                        <line x1="7" y1="10" x2="17" y2="16" strokeWidth="1.5" stroke="#14b8a6" />

                        {/* Punto de intersección con el eje x (x₂) */}
                        <circle cx="12" cy="18" r="1.5" fill="#34d399" />

                        {/* Línea vertical punteada desde x₂ */}
                        <line x1="12" y1="18" x2="12" y2="14" strokeWidth="1" strokeDasharray="2 1" stroke="#14b8a6" />

                        {/* Etiquetas pequeñas */}
                        <text x="6" y="8.5" fontSize="3" fill="currentColor">x₀</text>
                        <text x="18" y="15" fontSize="3" fill="currentColor">x₁</text>
                        <text x="12.5" y="20" fontSize="3" fill="currentColor">x₂</text>
                      </svg>
                    </div>
                    <h3 className="px-2 text-xl font-bold text-white">Secante</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Método iterativo que utiliza la derivada de la función para aproximarse rápidamente a la raíz.
                  </p>
                  <div className="flex items-center text-teal-400 group-hover:text-teal-300">
                    <span>Explorar método</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Método 4 */}
            <Link to="/metodos/newton" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center mr-3">
                      {/* svg personalizado*/}
                    </div>
                    <h3 className="px-2 text-xl font-bold text-white">Newton</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Método iterativo que usa derivadas para aproximar raíces de funciones no lineales.
                  </p>
                  <div className="flex items-center text-teal-400 group-hover:text-teal-300">
                    <span>Explorar método</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Método 5 */}
            <Link to="/metodos/punto-fijo" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center mr-3">
                      {/* svg personalizado*/}
                    </div>
                    <h3 className="px-2 text-xl font-bold text-white">Punto Fijo</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Reorganiza f(x)=0 a x=g(x) para iterar y buscar un punto fijo.
                  </p>
                  <div className="flex items-center text-teal-400 group-hover:text-teal-300">
                    <span>Explorar método</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Método 6 */}
            <Link to="/metodos/raices-multiples" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center mr-3">
                      {/* svg personalizado*/}
                    </div>
                    <h3 className="px-2 text-xl font-bold text-white">Raices Múltiples 1 o 2</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Iterativo especializado para raíces de multiplicidad mayor a 1.
                  </p>
                  <div className="flex items-center text-teal-400 group-hover:text-teal-300">
                    <span>Explorar método</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
            <br></br>

          </div>
          {/* Capítulo 2 */}
          <h3 className="text-left text-2xl font-bold text-white mb-4 mt-12">Capítulo 2</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Jacobi */}
            <Link to="/metodos/cap2/jacobi" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Jacobi</h3>
                  <p className="text-gray-400 mb-6">Iterativo para sistemas lineales, basado en descomposición diagonal.</p>
                </div>
              </div>
            </Link>
            {/* Gauss-Seidel */}
            <Link to="/metodos/cap2/gauss-seidel" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Gauss-Seidel</h3>
                  <p className="text-gray-400 mb-6">Iterativo que usa valores actualizados para mayor eficiencia.</p>
                </div>
              </div>
            </Link>
            {/* SOR */}
            <Link to="/metodos/cap2/sor" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">SOR</h3>
                  <p className="text-gray-400 mb-6">Gauss-Seidel con factor de relajación w para mejorar convergencia.</p>
                </div>
              </div>
            </Link>
            <br></br>
          </div>

          {/* Capítulo 3 */}
          <h3 className="text-left text-2xl font-bold text-white mb-4 mt-12">Capítulo 3</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Métodos Interpolación: Vandermonde, Newton Interpolante, Lagrange, Splines */}
            <Link to="/metodos/vander" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Vandermonde</h3>
                  <p className="text-gray-400 mb-6">Construcción de polinomios interpolantes usando matrices de Vandermonde.</p>
                </div>
              </div>
            </Link>
            <Link to="/metodos/newton-interpolante" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Newton Interpolante</h3>
                  <p className="text-gray-400 mb-6">Interpolación con diferencias divididas para aproximar funciones.</p>
                </div>
              </div>
            </Link>
            <Link to="/metodos/lagrange" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Lagrange</h3>
                  <p className="text-gray-400 mb-6">Interpolación polinómica a partir de puntos dados.</p>
                </div>
              </div>
            </Link>
            <Link to="/metodos/spline" className="group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-teal-500/50">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Splines Lineal y Cúbico</h3>
                  <p className="text-gray-400 mb-6">Ajuste suave de curvas usando segmentos lineales o cúbicos.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-7 px-4 sm:px-6 lg:px-8 bg-gray-900/80 border-t border-gray-800">
        <div className=" mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <div className="absolute inset-0 bg-teal-800 rounded-lg transform rotate-45"></div>
                <div className="absolute inset-1 bg-teal-500 rounded-md transform rotate-12"></div>
                <div className="absolute inset-2 bg-teal-400 rounded-sm transform -rotate-12"></div>
                <div className="absolute inset-3 bg-white dark:bg-gray-800 rounded-sm"></div>
                <div className="absolute inset-4 bg-teal-600 rounded-sm transform -rotate-90"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                FRACTAL
              </span>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FRACTAL. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default home