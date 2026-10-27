<?php

declare(strict_types=1);

namespace App\Core;

class Request
{
    private string $method;
    private string $uri;
    private array $headers;
    private array $queryParams;
    private array $body;

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $rawUri = $_SERVER['REQUEST_URI'] ?? '/';
        $this->uri = parse_url($rawUri, PHP_URL_PATH) ?? '/';
        $this->queryParams = $_GET;

        $rawBody = file_get_contents('php://input');
        $json = json_decode($rawBody, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
            $this->body = $json;
        } else {
            $this->body = $_POST;
        }

        $this->headers = getallheaders() ?: [];
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function getUri(): string
    {
        return $this->uri;
    }

    public function query(?string $key = null, mixed $default = null): mixed
    {
        if ($key === null) {
            return $this->queryParams;
        }
        return $this->queryParams[$key] ?? $default;
    }

    public function input(?string $key = null, mixed $default = null): mixed
    {
        if ($key === null) {
            return $this->body;
        }
        return $this->body[$key] ?? $default;
    }

    public function header(string $key, ?string $default = null): ?string
    {
        foreach ($this->headers as $hKey => $hVal) {
            if (strcasecmp($hKey, $key) === 0) {
                return $hVal;
            }
        }
        return $default;
    }
}
