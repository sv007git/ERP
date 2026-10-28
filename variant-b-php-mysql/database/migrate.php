<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Core/Database.php';

use App\Core\Database;

echo "=== ERP Database Migration Runner ===\n";

try {
    $pdo = Database::getConnection();
    echo "Connected to database successfully.\n";

    // Create migrations log table if not exists
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            migration VARCHAR(255) NOT NULL UNIQUE,
            batch INT NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Fetch already executed migrations
    $executed = $pdo->query("SELECT migration FROM migrations")->fetchAll(PDO::FETCH_COLUMN);

    $migrationFiles = glob(__DIR__ . '/migrations/*.sql');
    sort($migrationFiles);

    $batch = 1;
    $maxBatch = $pdo->query("SELECT MAX(batch) FROM migrations")->fetchColumn();
    if ($maxBatch !== false && $maxBatch !== null) {
        $batch = (int)$maxBatch + 1;
    }

    $count = 0;
    foreach ($migrationFiles as $file) {
        $baseName = basename($file);
        if (in_array($baseName, $executed, true)) {
            continue;
        }

        echo "Migrating: {$baseName}...\n";
        $sql = file_get_contents($file);

        // Execute queries separated by semicolon
        $pdo->beginTransaction();
        try {
            $queries = array_filter(array_map('trim', explode(';', $sql)));
            foreach ($queries as $query) {
                if (!empty($query)) {
                    $pdo->exec($query);
                }
            }

            $stmt = $pdo->prepare("INSERT INTO migrations (migration, batch) VALUES (:migration, :batch)");
            $stmt->execute(['migration' => $baseName, 'batch' => $batch]);
            $pdo->commit();
            echo "Migrated:  {$baseName} [OK]\n";
            $count++;
        } catch (Exception $e) {
            $pdo->rollBack();
            echo "FAILED: {$baseName} - {$e->getMessage()}\n";
            exit(1);
        }
    }

    if ($count === 0) {
        echo "Nothing to migrate. Database is up to date.\n";
    } else {
        echo "Migration complete! {$count} migration(s) executed.\n";
    }
} catch (Exception $e) {
    echo "Fatal migration error: {$e->getMessage()}\n";
    exit(1);
}
