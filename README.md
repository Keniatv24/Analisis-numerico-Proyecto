# Proyecto de Métodos Numéricos

## Autores
- **Juan Diego Robles de la Ossa**
- **Luis Moreno Gutiérrez**

## Descripción del Proyecto

Este proyecto implementa una colección completa de métodos numéricos fundamentales, divididos en tres capítulos principales: búsqueda de raíces de ecuaciones no lineales, resolución de sistemas de ecuaciones lineales e interpolación polinomial. La aplicación utiliza **Django** como backend para el procesamiento de cálculos y **React** como frontend para una interfaz moderna e interactiva que permite visualizar resultados, comparar métodos y generar informes automáticos de rendimiento.

## Contenido del Proyecto

### Capítulo 1: Métodos de Búsqueda de Raíces

**Métodos Implementados:**
- **Bisección**: Método de intervalo que garantiza convergencia
- **Regla Falsa (Falsa Posición)**: Mejora del método de bisección con convergencia más rápida
- **Punto Fijo**: Transformación de f(x)=0 a x=g(x)
- **Newton-Raphson**: Método de convergencia cuadrática usando derivadas
- **Secante**: Aproximación al método de Newton sin cálculo directo de derivadas
- **Raíces Múltiples**: Método especializado para raíces de multiplicidad mayor a 1

### Capítulo 2: Métodos Iterativos para Sistemas de Ecuaciones Lineales

**Métodos Implementados:**
- **Jacobi**: Método iterativo clásico para resolver sistemas lineales
- **Gauss-Seidel**: Mejora del método de Jacobi con convergencia más rápida
- **SOR (Successive Over-Relaxation)**: Método con factor de relajación para acelerar la convergencia

### Capítulo 3: Métodos de Interpolación

**Métodos Implementados:**
- **Vandermonde**: Interpolación mediante matriz de Vandermonde
- **Newton Interpolante**: Diferencias divididas de Newton
- **Lagrange**: Interpolación mediante polinomios de Lagrange
- **Spline Lineal**: Interpolación por tramos lineales
- **Spline Cúbico**: Interpolación por tramos cúbicos suaves

## Requisitos del Sistema

### Dependencias del Backend (Python/Django)
```
- Python 3.8+
- Django >= 4.0.0
- NumPy >= 1.20.0
- Matplotlib >= 3.3.0
- SciPy >= 1.7.0
- SymPy >= 1.8.0 (para cálculo simbólico de derivadas)
- Django REST Framework
- Django CORS Headers
```

### Dependencias del Frontend (Node.js/React)
```
- Node.js >= 16.0.0
- npm >= 8.0.0
- React >= 18.0.0
- Axios (para comunicación con el backend)
- Chart.js o D3.js (para visualizaciones)
```

## Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/usuario/proyecto-metodos-numericos.git
cd proyecto-metodos-numericos
```

### 2. Configuración del Backend (Django)

#### Crear y activar entorno virtual
```bash
cd backend
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate
```

#### Instalar dependencias de Python
```bash
pip install -r requirements.txt
```

### Desactivar entorno virtual
```bash
deactivate
```

### 3. Configuración del Frontend (React)

#### Instalar dependencias de Node.js
```bash
cd ../frontend
npm install
```

## Cómo Ejecutar el Proyecto

### Ejecución Completa del Sistema

#### 1. Iniciar el Backend (Django)
```bash
# Navegar al directorio backend
cd backend

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Ejecutar el servidor Django
python manage.py runserver
```
*El backend estará disponible en: http://localhost:8000*

#### 2. Iniciar el Frontend (React)
```bash
# En una nueva terminal, navegar al directorio frontend
cd frontend

# Ejecutar el servidor de desarrollo
npm run dev
```
*El frontend estará disponible en: http://localhost:5173*

## Resolución de Problemas Comunes

### Error: "Función no válida"
- **Causa**: Sintaxis incorrecta en la función ingresada
- **Solución**: Usar notación Python (x^22 en lugar de x**2, sin(x) en lugar de sen(x))

### Error: "Derivada no encontrada automáticamente"
- **Causa**: Función muy compleja para el calculador automático
- **Solución**: Ingresar derivada manualmente o simplificar la función

### Error: "No hay cambio de signo en el intervalo"
- **Causa**: f(a) y f(b) tienen el mismo signo para métodos de bisección
- **Solución**: Buscar un intervalo donde la función cambie de signo

### Error: "Método no converge"
- **Causa**: Condiciones iniciales inadecuadas o función problemática
- **Solución**: Cambiar valores iniciales o probar otro método

### Error: "Matriz no convergente"
- **Causa**: Radio espectral ≥ 1
- **Solución**: Verificar que la matriz sea diagonalmente dominante

### Error: "Puntos colineales en interpolación"
- **Causa**: Todos los puntos están en línea recta
- **Solución**: Agregar puntos no colineales o usar interpolación lineal

### Error: "Memoria insuficiente"
- **Causa**: Matriz muy grande o demasiadas iteraciones
- **Solución**: Reducir el tamaño o ajustar parámetros de convergencia

## Contacto

Para preguntas o sugerencias, contactar a los autores:
- Juan Diego Robles de la Ossa
- Luis Moreno Gutiérrez

---

*Última actualización: Mayo 2025*