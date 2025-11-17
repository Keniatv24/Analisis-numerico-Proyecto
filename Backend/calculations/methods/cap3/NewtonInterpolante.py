from typing import List, Optional, Dict, Any
import numpy as np


def newton_interpolation(x: List[float], y: List[float], x_eval: Optional[List[float]] = None) -> Dict[str, Any]:
    """
    Polinomio interpolante de Newton (diferencias divididas).

    Returns:
        dict con:
            - a: coeficientes de Newton [a0, a1, ..., an-1]
            - dd_table: tabla completa de diferencias divididas (triangular)
            - polynomial_newton: string en forma de Newton
            - coefficients_std: coeficientes del polinomio en forma estándar (mayor a menor)
            - y_eval: evaluación opcional en x_eval
    """
    n = len(x)
    if n != len(y) or n == 0:
        raise ValueError("Listas x e y inválidas")
    if len(set(x)) != n:
        raise ValueError("Los nodos deben ser distintos")

    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)

    # Construir tabla de diferencias divididas
    dd = np.zeros((n, n), dtype=float)
    dd[:, 0] = y_arr
    for j in range(1, n):
        for i in range(n - j):
            dd[i, j] = (dd[i + 1, j - 1] - dd[i, j - 1]) / (x_arr[i + j] - x_arr[i])

    a = dd[0, :].copy()  # coeficientes

    # String forma de Newton
    def _newton_str(a_coef: np.ndarray, x_nodes: np.ndarray) -> str:
        terms = []
        for k, ak in enumerate(a_coef):
            if abs(ak) < 1e-14:
                continue
            facs = []
            for i in range(k):
                xi = x_nodes[i]
                # (x - xi)
                if abs(xi) < 1e-12:
                    facs.append("x")
                else:
                    facs.append(f"(x - {xi:.10g})")
            fac = "·".join(facs)
            if fac:
                terms.append(f"{ak:.10g}·{fac}")
            else:
                terms.append(f"{ak:.10g}")
        return " + ".join(terms) if terms else "0"

    # Convertir a forma estándar multiplicando los factores
    # Usamos numpy.poly1d para componer (x - x0)(x - x1)...
    p = np.poly1d([0.0])
    base = np.poly1d([1.0])
    for k, ak in enumerate(a):
        if k == 0:
            p = np.poly1d([ak])
        else:
            base *= np.poly1d([1.0, -x_arr[k-1]])
            p = p + ak * base
    coeffs_std = p.c

    res: Dict[str, Any] = {
        "a": a.tolist(),
        "dd_table": dd.tolist(),
        "polynomial_newton": _newton_str(a, x_arr),
        "coefficients_std": coeffs_std.tolist(),
    }

    if x_eval is not None:
        xq = np.asarray(x_eval, dtype=float)
        # Evaluación por forma de Newton (Horner generalizado)
        yq = np.zeros_like(xq)
        for idx, xv in enumerate(xq):
            val = 0.0
            for k in range(n - 1, -1, -1):
                val = a[k] + (xv - x_arr[k - 1]) * val if k > 0 else a[0] + 0 * val
            yq[idx] = val
        res["x_eval"] = xq.tolist()
        res["y_eval"] = yq.tolist()

    return res
