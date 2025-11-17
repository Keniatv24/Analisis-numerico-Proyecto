import numpy as np

def forward_substitution(L, b):
    n = L.shape[0]
    y = np.zeros(n, dtype=float)
    for i in range(n):
        y[i] = (b[i] - np.dot(L[i, :i], y[:i])) / (L[i, i] if L[i, i] != 0 else 1.0)
    return y

def backward_substitution(U, y):
    n = U.shape[0]
    x = np.zeros(n, dtype=float)
    for i in reversed(range(n)):
        if U[i, i] == 0:
            raise ZeroDivisionError("Pivote cero en U.")
        x[i] = (y[i] - np.dot(U[i, i+1:], x[i+1:])) / U[i, i]
    return x

def lu_simple(A, b=None):
    """
    LU sin pivoteo (Doolittle: diag(L)=1).
    Retorna diccionario serializable (listas), y si llega b resuelve Ax=b.
    """
    out = {'L': None, 'U': None, 'solution': None, 'conclusion': None}

    A = np.array(A, dtype=float)
    if A.ndim != 2 or A.shape[0] != A.shape[1]:
        out['conclusion'] = "La matriz A debe ser cuadrada."
        return out

    n = A.shape[0]
    L = np.zeros_like(A)
    U = np.zeros_like(A)

    try:
        for i in range(n):
            # U fila i
            for k in range(i, n):
                U[i, k] = A[i, k] - np.dot(L[i, :i], U[:i, k])
            if U[i, i] == 0:
                out['conclusion'] = "Pivote cero: LU sin pivoteo no es posible."
                return out
            # L columna i
            L[i, i] = 1.0
            for k in range(i+1, n):
                L[k, i] = (A[k, i] - np.dot(L[k, :i], U[:i, i])) / U[i, i]

        out['L'] = L.tolist()
        out['U'] = U.tolist()

        if b is not None:
            b = np.array(b, dtype=float)
            if b.shape[0] != n:
                out['conclusion'] = "Dimensión de b incompatible con A."
                return out
            y = forward_substitution(L, b)
            x = backward_substitution(U, y)
            out['solution'] = x.tolist()

        out['conclusion'] = "OK"
        return out

    except Exception as e:
        out['conclusion'] = f"Error: {e}"
        return out
