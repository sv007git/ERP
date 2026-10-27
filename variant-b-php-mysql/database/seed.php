<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Core/Database.php';
require_once __DIR__ . '/seeders/DatabaseSeeder.php';

use App\Core\Database;
use App\Database\Seeders\DatabaseSeeder;

echo "=== Dreams ERP Database Seeder ===\n";

try {
    $pdo = Database::getConnection();
    DatabaseSeeder::seed($pdo);
    echo "Seed operation completed successfully.\n";
} catch (Exception $e) {
    echo "Seeding failed: " . $e->getMessage() . "\n";
    exit(1);
}
