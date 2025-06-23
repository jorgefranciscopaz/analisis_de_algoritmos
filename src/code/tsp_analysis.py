import time
import itertools
import random
import math
import matplotlib.pyplot as plt
import pandas as pd
import sys

def generate_random_coordinates(n, width=100, height=100):
    return [(random.randint(0, width), random.randint(0, height)) for _ in range(n)]

def euclidean_distance(p1, p2):
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)

def create_distance_matrix(coords):
    n = len(coords)
    dist = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            dist[i][j] = euclidean_distance(coords[i], coords[j])
    return dist

def tsp_brute_force(dist):
    n = len(dist)
    nodes = list(range(n))
    min_cost = float('inf')
    best_path = []

    total = math.factorial(n - 1)
    for idx, perm in enumerate(itertools.permutations(nodes[1:])):
        path = [0] + list(perm)
        cost = sum(dist[path[i]][path[i + 1]] for i in range(n - 1)) + dist[path[-1]][0]
        if cost < min_cost:
            min_cost = cost
            best_path = path + [0]
        if idx % 1000 == 0:
            percent = (idx / total) * 100
            sys.stdout.write(f"\rFuerza Bruta Progreso: {percent:.2f}%")
            sys.stdout.flush()

    return best_path, min_cost

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

def tsp_random_solution(dist):
    n = len(dist)
    nodes = list(range(1, n))
    random.shuffle(nodes)
    path = [0] + nodes + [0]
    cost = sum(dist[path[i]][path[i + 1]] for i in range(n))
    return path, cost

def measure_time(func, *args):
    start = time.time()
    result = func(*args)
    end = time.time()
    return result, end - start

def visualize_path(coords, path, title):
    x = [coords[i][0] for i in path]
    y = [coords[i][1] for i in path]
    plt.figure()
    plt.plot(x, y, marker='o')
    for i, (xi, yi) in enumerate(zip(x, y)):
        plt.text(xi + 1, yi + 1, str(i if i < len(path) - 1 else 0), fontsize=9)
    plt.title(title)
    plt.xlabel('X')
    plt.ylabel('Y')
    plt.grid(True)

# === INICIO ===
if __name__ == "__main__":
    num_cities = int(input("Ingrese el número de ciudades que desea analizar: "))
    coords = generate_random_coordinates(num_cities)
    dist_matrix = create_distance_matrix(coords)

    results = {}

    print("\n🔄 Ejecutando algoritmo de Fuerza Bruta (Exacto)...")
    (bf_path, bf_cost), bf_time = measure_time(tsp_brute_force, dist_matrix)
    results['Fuerza Bruta (Exacto)'] = (bf_cost, bf_time, bf_path)
    print("\n✅ Fuerza Bruta completado.")

    print("⚡ Ejecutando algoritmo de Vecino Más Cercano (Heurístico)...")
    (nn_path, nn_cost), nn_time = measure_time(tsp_nearest_neighbor, dist_matrix)
    results['Vecino Más Cercano (Heurístico)'] = (nn_cost, nn_time, nn_path)
    print("✅ Vecino Más Cercano completado.")

    print("🎲 Ejecutando algoritmo de Solución Aleatoria (Base)...")
    (rs_path, rs_cost), rs_time = measure_time(tsp_random_solution, dist_matrix)
    results['Solución Aleatoria (Base)'] = (rs_cost, rs_time, rs_path)
    print("✅ Solución Aleatoria completada.")

    # Visualizar rutas
    visualize_path(coords, bf_path, "Ruta - Fuerza Bruta (Exacto)")
    visualize_path(coords, nn_path, "Ruta - Vecino Más Cercano (Heurístico)")
    visualize_path(coords, rs_path, "Ruta - Solución Aleatoria (Base)")
    plt.show()

    # Mostrar tabla
    df = pd.DataFrame([
        {'Método': method, 'Costo total': f"{cost:.2f}", 'Tiempo (s)': f"{exec_time:.5f}"}
        for method, (cost, exec_time, _) in results.items()
    ])

    print("\n📊 Comparativa de algoritmos:")
    print(df.to_string(index=False))
