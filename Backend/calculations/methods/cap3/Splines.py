from typing import List, Literal, Dict, Any, Optional
import numpy as np

SplineType = Literal['lineal', 'cubo_natural']


def spline_interpolation(
    x: List[float],
    y: List[float],
    tipo: SplineType = 'lineal',
    x_eval: Optional[List[float]] = None
) -> Dict[str, Any]:
    """
    Interpolación por splines.

    tipo:
        - 'lineal': segmentos lineales entre nodos
        - 'cubo_natural': spline cúbico natural (segunda derivada 0 en extremos)
    """
    n = len(x)
    if n != len(y) or n < 2:
        raise ValueError("Listas inválidas para spline")
    if len(set(x)) != n:
        raise ValueError("Nodos repetidos no permitidos")

    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)
    order = np.argsort(x_arr)
    x_arr = x_arr[order]
    y_arr = y_arr[order]

    if tipo == 'lineal':
        segments = []
        for i in range(n - 1):
            x0, x1 = x_arr[i], x_arr[i + 1]
            y0, y1 = y_arr[i], y_arr[i + 1]
            # y = m(x-x0) + y0 => y = m x + (y0 - m x0)
            m = (y1 - y0) / (x1 - x0)
            b = y0 - m * x0
            segments.append({
                'interval': [float(x0), float(x1)],
                'm': float(m),
                'b': float(b),
                'polynomial': f"{m:.10g}·x + {b:.10g}"
            })
        res: Dict[str, Any] = {"type": tipo, "segments": segments}
        if x_eval is not None:
            yq = [_eval_lineal(segments, xv) for xv in x_eval]
            res['x_eval'] = x_eval
            res['y_eval'] = yq
        return res

    elif tipo == 'cubo_natural':
        # Basado en resolución clásica de sistema tridiagonal para segundas derivadas
        h = np.diff(x_arr)
        al = np.zeros(n)
        for i in range(1, n - 1):
            al[i] = (3 / h[i]) * (y_arr[i + 1] - y_arr[i]) - (3 / h[i - 1]) * (y_arr[i] - y_arr[i - 1])

        l = np.ones(n)
        mu = np.zeros(n)
        z = np.zeros(n)
        for i in range(1, n - 1):
            l[i] = 2 * (x_arr[i + 1] - x_arr[i - 1]) - h[i - 1] * mu[i - 1]
            mu[i] = h[i] / l[i]
            z[i] = (al[i] - h[i - 1] * z[i - 1]) / l[i]
        c = np.zeros(n)
        b = np.zeros(n - 1)
        d = np.zeros(n - 1)
        a = y_arr[:-1].copy()
        for j in range(n - 2, -1, -1):
            c[j] = z[j] - mu[j] * c[j + 1]
            b[j] = (y_arr[j + 1] - y_arr[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3
            d[j] = (c[j + 1] - c[j]) / (3 * h[j])

        segments = []
        for i in range(n - 1):
            segments.append({
                'interval': [float(x_arr[i]), float(x_arr[i + 1])],
                'a': float(a[i]),
                'b': float(b[i]),
                'c': float(c[i]),
                'd': float(d[i]),
                'polynomial': f"{a[i]:.10g} + {b[i]:.10g}(x-{x_arr[i]:.10g}) + {c[i]:.10g}(x-{x_arr[i]:.10g})^2 + {d[i]:.10g}(x-{x_arr[i]:.10g})^3"
            })
        res2: Dict[str, Any] = {
            'type': tipo,
            'segments': segments,
            'coefficients_a': a.tolist(),
            'coefficients_b': b.tolist(),
            'coefficients_c': c.tolist(),
            'coefficients_d': d.tolist(),
        }
        if x_eval is not None:
            yq = [_eval_cubic(segments, xv) for xv in x_eval]
            res2['x_eval'] = x_eval
            res2['y_eval'] = yq
        return res2
    else:
        raise ValueError("Tipo de spline no soportado")


def _eval_lineal(segments, xv: float) -> float:
    for seg in segments:
        a, b = seg['interval']
        if a <= xv <= b:
            return seg['m'] * xv + seg['b']
    # fuera de rango: extrapolación simple usando borde más cercano
    if xv < segments[0]['interval'][0]:
        seg = segments[0]
        return seg['m'] * xv + seg['b']
    seg = segments[-1]
    return seg['m'] * xv + seg['b']


def _eval_cubic(segments, xv: float) -> float:
    for seg in segments:
        a_int, b_int = seg['interval']
        if a_int <= xv <= b_int:
            dx = xv - a_int
            return seg['a'] + seg['b'] * dx + seg['c'] * dx**2 + seg['d'] * dx**3
    # extrapolación simple usando el intervalo más cercano
    if xv < segments[0]['interval'][0]:
        seg = segments[0]
        dx = xv - seg['interval'][0]
        return seg['a'] + seg['b'] * dx + seg['c'] * dx**2 + seg['d'] * dx**3
    seg = segments[-1]
    dx = xv - seg['interval'][0]
    return seg['a'] + seg['b'] * dx + seg['c'] * dx**2 + seg['d'] * dx**3
