from typing import List, Optional, Dict, Any
import numpy as np


def vandermonde_interpolation(x: List[float], y: List[float], x_eval: Optional[List[float]] = None) -> Dict[str, Any]:
    """
    Construye el polinomio interpolante mediante la matriz de Vandermonde.

    Args:
        x: nodos (longitud n, todos distintos)
        y: valores f(x) (longitud n)
        x_eval: puntos a evaluar opcionalmente

    Returns:
        dict con:
            - coefficients: coeficientes del polinomio en forma estándar (grado de mayor a menor)
            - polynomial: string del polinomio en forma estándar
            - vandermonde: matriz V
            - solution: solución del sistema (coeficientes, vector columna)
            - y_eval: valores evaluados si se entregan x_eval
    """
    n = len(x)
    if n != len(y) or n == 0:
        raise ValueError("Listas x e y inválidas")
    if len(set(x)) != n:
        raise ValueError("Los nodos deben ser distintos")

    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)

    # V[i, j] = x_i**(n-1-j) para obtener coeficientes descendentes
    V = np.vander(x_arr, N=n, increasing=False)
    coeffs = np.linalg.solve(V, y_arr)

    # Construir string del polinomio
    def _poly_to_str(c: np.ndarray) -> str:
        terms = []
        deg = len(c) - 1
        for i, a in enumerate(c):
            power = deg - i
            if abs(a) < 1e-14:
                continue
            coef = f"{a:.10g}"
            if power == 0:
                terms.append(f"{coef}")
            elif power == 1:
                terms.append(f"{coef}·x")
            else:
                terms.append(f"{coef}·x^{power}")
        return " + ".join(terms) if terms else "0"

    result: Dict[str, Any] = {
        "coefficients": coeffs.tolist(),
        "polynomial": _poly_to_str(coeffs),
        "vandermonde": V.tolist(),
        "solution": coeffs.reshape(-1, 1).tolist(),
    }

    if x_eval is not None:
        xq = np.asarray(x_eval, dtype=float)
        yq = np.polyval(coeffs, xq)
        result["x_eval"] = xq.tolist()
        result["y_eval"] = yq.tolist()

    return result
