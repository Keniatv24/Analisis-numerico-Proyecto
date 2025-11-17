import numpy as np

def cholesky(A, b=None):
    """Cholesky A = L L^T (requiere A simétrica definida positiva)."""
    results = {'L': None, 'solution': None, 'conclusion': None}
    A = np.array(A, dtype=float)
    n, m = A.shape
    if n != m:
        results['conclusion'] = "La matriz A debe ser cuadrada."
        return results

    if not np.allclose(A, A.T, atol=1e-10):
        results['conclusion'] = "A debe ser simétrica para Cholesky."
        return results

    L = np.zeros_like(A)

    try:
        for i in range(n):
            s = np.dot(L[i, :i], L[i, :i])
            val = A[i, i] - s
            if val <= 0:
                results['conclusion'] = "A no es definida positiva."
                return results
            L[i, i] = np.sqrt(val)
            for j in range(i+1, n):
                L[j, i] = (A[j, i] - np.dot(L[j, :i], L[i, :i])) / L[i, i]

        results['L'] = L

        if b is not None:
            b = np.array(b, dtype=float)
            # Forward: L y = b
            y = np.zeros(n)
            for i in range(n):
                y[i] = (b[i] - np.dot(L[i, :i], y[:i])) / L[i, i]
            # Backward: L^T x = y
            x = np.zeros(n)
            LT = L.T
            for i in reversed(range(n)):
                x[i] = (y[i] - np.dot(LT[i, i+1:], x[i+1:])) / LT[i, i]
            results['solution'] = x.tolist()

        results['conclusion'] = "OK"
        return results
    except Exception as e:
        results['conclusion'] = f"Error: {e}"
        return results
