from rest_framework.decorators import api_view
from rest_framework.response import Response
from .methods.ReglaFalsa import false_position_method
from .methods.Secante import secant_method
from .methods.RaicesMultiples import multiple_roots_method
from .methods.Biseccion import bisection_method
from .methods.PuntoFijo import fixed_point_method
from .methods.Newton import newton_method
from .methods.cap2.Jacobi import jacobi_method
from .methods.cap2.GaussSeidel import gaussSeidel_method
from .methods.cap2.Sor import sor_method
from .methods.cap2.LU_simple import lu_simple
from .methods.cap2.LU_pivoteo import lu_pivoteo_parcial
from .methods.cap2.Crout import crout
from .methods.cap2.Doolittle import doolittle
from .methods.cap2.Cholesky import cholesky
from .methods.cap3.Vandermonde import vandermonde_interpolation
from .methods.cap3.NewtonInterpolante import newton_interpolation
from .methods.cap3.Lagrange import lagrange_interpolation
from .methods.cap3.Splines import spline_interpolation



@api_view(['GET'])
def test_calculations(request):
    return Response({"message": "Calculations API is ready!"})

@api_view(['POST'])
def calculate_regla_falsa(request):

    try:
        # Leer los datos enviados desde el frontend.
        data = request.data
        function_text = data.get('function_text')
        a = float(data.get('a'))
        b = float(data.get('b'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not function_text or a is None or b is None or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Regla Falsa.
        results = false_position_method(function_text, a, b, tol, max_count)

        return Response(results, status=200)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)

@api_view(['POST'])
def calculate_secant(request):

    try:
        # Leer los datos enviados desde el frontend.
        data = request.data
        function_text = data.get('function_text')
        x0 = float(data.get('x0'))
        x1 = float(data.get('x1'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not function_text or x0 is None or x1 is None or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Regla Falsa.
        results = secant_method(function_text, x0, x1, tol, max_count)

        return Response(results, status=200)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)

@api_view(['POST'])
def calculate_multiple_roots(request):

    try:
        # Leer los datos enviados desde el frontend.
        data = request.data
        function_text = data.get('function_text')
        first_derivate_text = data.get('first_derivate_text')
        second_derivate_text = data.get('second_derivate_text')
        x0 = float(data.get('x0'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not function_text or not first_derivate_text or not second_derivate_text or x0 is None or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Raíces Múltiples.
        results = multiple_roots_method(function_text, first_derivate_text, second_derivate_text, x0, tol, max_count)

        return Response(results, status=200)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)
    

@api_view(['POST'])
def calculate_biseccion(request):

    try:
        # Leer los datos enviados desde el frontend.
        data = request.data
        function_text = data.get('function_text')
        a = float(data.get('a'))
        b = float(data.get('b'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not function_text or a is None or b is None or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Bisección.
        results = bisection_method(function_text, a, b, tol, max_count)

        return Response(results, status=200)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)
    



@api_view(['POST'])
def calculate_fixed_point(request):
    try:
        # Leer los datos enviados desde el frontend.
        data = request.data
        function_text = data.get('function_text')
        gfunction_text = data.get('gfunction_text')
        x0 = float(data.get('x0'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not function_text or gfunction_text is None or x0 is None or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Punto Fijo.
        results = fixed_point_method(function_text, gfunction_text, x0, tol, max_count)

        return Response(results, status=200)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)
    


@api_view(['POST'])
def calculate_newton(request):
    try:
        # Leer los datos enviados desde el frontend.
        data = request.data
        function_text = data.get('function_text')
        first_derivate_text = data.get('first_derivate_text')
        x0 = float(data.get('x0'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not function_text or not first_derivate_text or x0 is None or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Newton.
        results = newton_method(function_text, first_derivate_text, x0, tol, max_count)

        return Response(results, status=200)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)



@api_view(['POST'])
def calculate_jacobi(request):
    try:
        # Leer los datos enviados desde el frontend.
        data = request.data
        matrixA = data.get('matrix')
        vectorB = data.get('vector_b')
        vectorX0 = data.get('vector_x0')
        norm_type = float(data.get('norm'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not matrixA or not vectorB or not vectorX0 or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Jacobi.
        results = jacobi_method(matrixA, vectorB, vectorX0, tol, max_count, norm_type)

        return Response(results, status=200)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)



@api_view(['POST'])
def calculate_gaussSeidel(request):
    try:
         # Leer los datos enviados desde el frontend.
        data = request.data
        matrixA = data.get('matrix')
        vectorB = data.get('vector_b')
        vectorX0 = data.get('vector_x0')
        norm_type = float(data.get('norm'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not matrixA or not vectorB or not vectorX0 or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Jacobi.
        results = gaussSeidel_method(matrixA, vectorB, vectorX0, tol, max_count, norm_type)

        return Response(results, status=200)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)



@api_view(['POST'])
def calculate_sor(request):
    try:
         # Leer los datos enviados desde el frontend.
        data = request.data
        matrixA = data.get('matrix')
        vectorB = data.get('vector_b')
        vectorX0 = data.get('vector_x0')
        norm_type = float(data.get('norm'))
        w = float(data.get('w'))
        tol = float(data.get('tol'))
        max_count = int(data.get('max_count'))

        # Validar que los datos sean correctos.
        if not matrixA or not vectorB or not vectorX0 or tol is None or max_count is None:
            return Response({"error": "Faltan parámetros"}, status=400)

        # Llamar a la función del método de Jacobi.
        results = sor_method(matrixA, vectorB, vectorX0, tol, max_count, norm_type, w)

        print(results)
        return Response(results, status=200)

    except ValueError as e:
        print(e)
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        print(e)
        return Response({"error": "Error inesperado: " + str(e)}, status=500)

def _read_A_b(request):
    data = request.data
    A = data.get('matrix')
    b = data.get('vector_b', None)
    if A is None:
        return None, None, Response({"error": "Falta 'matrix'."}, status=400)
    return A, b, None

    


@api_view(['POST'])
def calculate_lu_simple(request):
    data = request.data
    A = data.get('matrix')
    b = data.get('vector_b', None)
    if A is None:
        return Response({"error": "Falta 'matrix'."}, status=400)
    results = lu_simple(A, b)
    return Response(results, status=200)

@api_view(['POST'])
def calculate_lu_pivoteo(request):
    A, b, err = _read_A_b(request)
    if err: return err
    results = lu_pivoteo_parcial(A, b)
    return Response(results, status=200)

@api_view(['POST'])
def calculate_crout(request):
    A, b, err = _read_A_b(request)
    if err: return err
    results = crout(A, b)
    return Response(results, status=200)

@api_view(['POST'])
def calculate_doolittle(request):
    A, b, err = _read_A_b(request)
    if err: return err
    results = doolittle(A, b)
    return Response(results, status=200)

@api_view(['POST'])
def calculate_cholesky(request):
    A, b, err = _read_A_b(request)
    if err: return err
    results = cholesky(A, b)
    return Response(results, status=200)


# ------------------------- Capítulo 3: Interpolación -------------------------
def _read_points(request):
    data = request.data
    points = data.get('points')
    if points is None:
        return None, Response({"error": "Falta 'points'"}, status=400)
    try:
        x = [float(p[0]) for p in points]
        y = [float(p[1]) for p in points]
    except Exception:
        return None, Response({"error": "Formato de 'points' inválido. Debe ser [[x,y],...]"}, status=400)
    x_eval = data.get('x_eval', None)
    if x_eval is not None:
        try:
            x_eval_f = [float(v) for v in x_eval]
        except Exception:
            return None, Response({"error": "Formato de 'x_eval' inválido."}, status=400)
    else:
        x_eval_f = None
    return (x, y, x_eval_f), None


@api_view(['POST'])
def calculate_vandermonde(request):
    parsed, err = _read_points(request)
    if err: return err
    x, y, x_eval = parsed
    try:
        res = vandermonde_interpolation(x, y, x_eval)
        res['method'] = 'vandermonde'
        return Response(res, status=200)
    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)


@api_view(['POST'])
def calculate_newton_interpolante(request):
    parsed, err = _read_points(request)
    if err: return err
    x, y, x_eval = parsed
    try:
        res = newton_interpolation(x, y, x_eval)
        res['method'] = 'newton_interpolante'
        return Response(res, status=200)
    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)


@api_view(['POST'])
def calculate_lagrange(request):
    parsed, err = _read_points(request)
    if err: return err
    x, y, x_eval = parsed
    try:
        res = lagrange_interpolation(x, y, x_eval)
        res['method'] = 'lagrange'
        return Response(res, status=200)
    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)


@api_view(['POST'])
def calculate_spline_lineal(request):
    parsed, err = _read_points(request)
    if err: return err
    x, y, x_eval = parsed
    try:
        res = spline_interpolation(x, y, 'lineal', x_eval)
        res['method'] = 'spline_lineal'
        return Response(res, status=200)
    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)


@api_view(['POST'])
def calculate_spline_cubico(request):
    parsed, err = _read_points(request)
    if err: return err
    x, y, x_eval = parsed
    try:
        res = spline_interpolation(x, y, 'cubo_natural', x_eval)
        res['method'] = 'spline_cubico_natural'
        return Response(res, status=200)
    except ValueError as e:
        return Response({"error": str(e)}, status=400)
    except Exception as e:
        return Response({"error": "Error inesperado: " + str(e)}, status=500)
