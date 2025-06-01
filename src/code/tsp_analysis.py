import time
import itertools
import random
import math
import matplotlib.pyplot as plt
import pandas as pd

# Función para generar coordenadas aleatorias
def generate_random_coordinates(n, width=100, height=100):
    return [(random.randint(0, width), random.randint(0, height)) for _ in range(n)]

# Distancia euclidiana
def euclidean_distance(p1, p2):
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)

# Crear matriz de distancias
def create_distance_matrix(coords):
    n = len(coords)
    dist = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            dist[i][j] = euclidean_distance(coords[i], coords[j])
    return dist

# Algoritmo de fuerza bruta
def tsp_brute_force(dist):
    n = len(dist)
    nodes = list(range(n))
    min_cost = float('inf')
    best_path = []

    for perm in itertools.permutations(nodes[1:]):
        path = [0] + list(perm)
        cost = sum(dist[path[i]][path[i+1]] for i in range(n - 1)) + dist[path[-1]][0]
        if cost < min_cost:
            min_cost = cost
            best_path = path + [0]

    return best_path, min_cost

# Algoritmo del vecino más cercano
def tsp_nearest_neighbor(dist):
    n = len(dist)
    visited = [False] * n
    path = [0]
    visited[0] = True
    cost = 0

    for _ in range(n - 1):
        last = path[-1]
        next_city = min((dist[last][j], j) for j in range(n) if not visited[j])[1]
        visited[next_city] = True
        path.append(next_city)
        cost += dist[last][next_city]

    cost += dist[path[-1]][0]
    path.append(0)
    return path, cost

# Medir tiempo de ejecución
def measure_time(func, dist):
    start = time.time()
    result = func(dist)
    end = time.time()
    return result, end - start

# Visualización del recorrido (opcional)
def visualize_path(coords, path, title):
    x = [coords[i][0] for i in path]
    y = [coords[i][1] for i in path]
    plt.figure()
    plt.plot(x, y, marker='o')
    plt.title(title)
    plt.xlabel('X')
    plt.ylabel('Y')
    plt.grid(True)
    plt.show()

# === INICIO ===
if __name__ == "__main__":
    # Solicitar número de ciudades
    num_cities = int(input("Ingrese el número de ciudades (<=10 para fuerza bruta): "))
    coords = generate_random_coordinates(num_cities)
    dist_matrix = create_distance_matrix(coords)

    results = {}

    # Ejecutar fuerza bruta si es seguro
    if num_cities <= 10:
        (bf_path, bf_cost), bf_time = measure_time(tsp_brute_force, dist_matrix)
        results['Fuerza Bruta'] = (bf_cost, bf_time, bf_path)
        visualize_path(coords, bf_path, "Ruta - Fuerza Bruta")

    # Ejecutar vecino más cercano
    (nn_path, nn_cost), nn_time = measure_time(tsp_nearest_neighbor, dist_matrix)
    results['Vecino Más Cercano'] = (nn_cost, nn_time, nn_path)
    visualize_path(coords, nn_path, "Ruta - Vecino Más Cercano")

    # Mostrar resultados
    df = pd.DataFrame([
        {'Método': method, 'Costo total': f"{cost:.2f}", 'Tiempo (s)': f"{exec_time:.5f}"}
        for method, (cost, exec_time, _) in results.items()
    ])

    print("\nResultados comparativos:")
    print(df.to_string(index=False))
