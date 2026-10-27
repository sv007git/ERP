<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use PDO;
use Exception;
use InvalidArgumentException;

class CrmService
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Database::getConnection();
    }

    public function advanceDealStage(string $orgId, string $dealId, string $newStage, ?int $probability = null): array
    {
        $stageProbabilities = [
            'Qualify To Buy' => 20,
            'Contact Made' => 40,
            'Presentation' => 60,
            'Proposal Made' => 80,
            'Appointment' => 90,
            'Won' => 100,
            'Lost' => 0
        ];

        $prob = $probability ?? ($stageProbabilities[$newStage] ?? 50);
        $status = ($newStage === 'Won') ? 'Won' : (($newStage === 'Lost') ? 'Lost' : 'Open');

        $stmt = $this->pdo->prepare("
            UPDATE deals 
            SET stage = ?, probability = ?, status = ? 
            WHERE id = ? AND organization_id = ?
        ");
        $stmt->execute([$newStage, $prob, $status, $dealId, $orgId]);

        // Add audit log
        $auditId = 'aud-' . bin2hex(random_bytes(6));
        $stmtAud = $this->pdo->prepare("
            INSERT INTO audit_logs (id, organization_id, action, entity_type, entity_id, details)
            VALUES (?, ?, 'stage_change', 'deal', ?, ?)
        ");
        $stmtAud->execute([$auditId, $orgId, $dealId, json_encode(['new_stage' => $newStage, 'prob' => $prob])]);

        return [
            'deal_id' => $dealId,
            'stage' => $newStage,
            'probability' => $prob,
            'status' => $status
        ];
    }

    public function addActivity(string $orgId, string $dealId, string $userId, array $data): array
    {
        $title = trim($data['title'] ?? '');
        $type = $data['type'] ?? 'note';
        if (empty($title)) {
            throw new InvalidArgumentException("Activity title is required.");
        }

        $actId = 'act-' . bin2hex(random_bytes(6));
        $stmt = $this->pdo->prepare("
            INSERT INTO deal_activities (id, organization_id, deal_id, user_id, type, title, description, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $actId,
            $orgId,
            $dealId,
            $userId,
            $type,
            $title,
            $data['description'] ?? null,
            $data['priority'] ?? 'Normal'
        ]);

        return [
            'id' => $actId,
            'deal_id' => $dealId,
            'title' => $title,
            'type' => $type
        ];
    }
}
