<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use Exception;

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(?array $customConfig = null): PDO
    {
        if (self::$instance !== null && $customConfig === null) {
            return self::$instance;
        }

        $config = $customConfig ?? self::loadConfig();
        $driver = $config['driver'] ?? 'sqlite';

        if ($driver === 'sqlite') {
            $dbPath = $config['database'] ?? (file_exists(__DIR__ . '/../../database/erp.sqlite') ? __DIR__ . '/../../database/erp.sqlite' : __DIR__ . '/../../database/dreams_erp.sqlite');
            $dir = dirname($dbPath);
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }
            $dsn = "sqlite:{$dbPath}";
            $pdo = new PDO($dsn, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $pdo->exec("PRAGMA foreign_keys = ON;");
        } else {
            $host = $config['host'] ?? '127.0.0.1';
            $port = $config['port'] ?? 3306;
            $db = $config['database'] ?? 'erp';
            $user = $config['username'] ?? 'root';
            $pass = $config['password'] ?? '';
            $charset = $config['charset'] ?? 'utf8mb4';

            $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset}",
            ]);
        }

        if ($customConfig === null) {
            self::$instance = $pdo;
        }

        return $pdo;
    }

    public static function transaction(callable $callback): mixed
    {
        $pdo = self::getConnection();
        $pdo->beginTransaction();
        try {
            $result = $callback($pdo);
            $pdo->commit();
            return $result;
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    private static function loadConfig(): array
    {
        $envFile = __DIR__ . '/../../.env';
        $env = [];
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
                    continue;
                }
                [$key, $value] = explode('=', $line, 2);
                $env[trim($key)] = trim(trim($value), "\"'");
            }
        }

        $driver = $env['DB_CONNECTION'] ?? 'sqlite';
        if ($driver === 'sqlite') {
            $file = $env['DB_FILE'] ?? (file_exists(__DIR__ . '/../../database/erp.sqlite') ? 'database/erp.sqlite' : 'database/dreams_erp.sqlite');
            $dbPath = (str_starts_with($file, '/') || str_contains($file, ':')) 
                ? $file 
                : __DIR__ . '/../../' . $file;
            return [
                'driver' => 'sqlite',
                'database' => $dbPath,
            ];
        }

        return [
            'driver' => 'mysql',
            'host' => $env['DB_HOST'] ?? '127.0.0.1',
            'port' => (int)($env['DB_PORT'] ?? 3306),
            'database' => $env['DB_DATABASE'] ?? 'erp',
            'username' => $env['DB_USERNAME'] ?? 'root',
            'password' => $env['DB_PASSWORD'] ?? '',
            'charset' => 'utf8mb4',
        ];
    }
}
