<?php

declare(strict_types=1);

namespace App\Core;

class Router
{
    private array $routes = [];

    public function get(string $path, callable|array $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, callable|array $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    public function patch(string $path, callable|array $handler): void
    {
        $this->addRoute('PATCH', $path, $handler);
    }

    public function delete(string $path, callable|array $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute(string $method, string $path, callable|array $handler): void
    {
        // Convert route pattern with {param} into regex
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
        $pattern = "#^" . $pattern . "$#";
        $this->routes[] = [
            'method' => $method,
            'pattern' => $pattern,
            'handler' => $handler,
        ];
    }

    public function dispatch(Request $request): void
    {
        $method = $request->getMethod();
        $uri = rtrim($request->getUri(), '/');
        if ($uri === '') {
            $uri = '/';
        }

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if (preg_match($route['pattern'], $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $handler = $route['handler'];

                if (is_callable($handler)) {
                    call_user_func($handler, $request, $params);
                    return;
                }

                if (is_array($handler) && count($handler) === 2) {
                    [$class, $methodName] = $handler;
                    $controller = new $class();
                    $controller->$methodName($request, $params);
                    return;
                }
            }
        }

        // 404 handler
        if (str_starts_with($uri, '/api/')) {
            Response::json(['success' => false, 'error' => ['code' => 'NOT_FOUND', 'message' => 'Endpoint not found']], 404);
        } else {
            Response::html('<h1>404 Not Found</h1><p>The requested page was not found.</p>', 404);
        }
    }
}
