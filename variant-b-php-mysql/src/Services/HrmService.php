<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use PDO;
use Exception;
use InvalidArgumentException;

class HrmService
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Database::getConnection();
    }

    public function applyLeave(string $orgId, string $empId, string $type, string $start, string $end, float $days, string $reason): array
    {
        $stmt = $this->pdo->prepare("SELECT leave_balance FROM employees WHERE id = ? AND organization_id = ?");
        $stmt->execute([$empId, $orgId]);
        $emp = $stmt->fetch();
        if (!$emp) {
            throw new InvalidArgumentException("Employee not found.");
        }

        if ((float)$emp['leave_balance'] < $days) {
            throw new InvalidArgumentException("Insufficient leave balance.");
        }

        $lrId = 'lr-' . bin2hex(random_bytes(6));
        $insert = $this->pdo->prepare("
            INSERT INTO leave_requests (id, organization_id, employee_id, leave_type, start_date, end_date, days_count, reason, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        ");
        $insert->execute([$lrId, $orgId, $empId, $type, $start, $end, $days, $reason]);

        return [
            'id' => $lrId,
            'employee_id' => $empId,
            'days_count' => $days,
            'status' => 'Pending'
        ];
    }

    public function approveLeave(string $orgId, string $leaveRequestId, string $approvedBy): array
    {
        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM leave_requests WHERE id = ? AND organization_id = ?");
            $stmt->execute([$leaveRequestId, $orgId]);
            $request = $stmt->fetch();
            if (!$request) {
                throw new InvalidArgumentException("Leave request not found.");
            }

            if ($request['status'] === 'Approved') {
                throw new InvalidArgumentException("Leave request is already approved.");
            }

            $empId = $request['employee_id'];
            $days = (float)$request['days_count'];

            // Fetch current balance
            $empStmt = $this->pdo->prepare("SELECT leave_balance FROM employees WHERE id = ?");
            $empStmt->execute([$empId]);
            $emp = $empStmt->fetch();

            $currentBalance = (float)$emp['leave_balance'];
            if ($currentBalance < $days) {
                throw new InvalidArgumentException("Employee has insufficient remaining leave days.");
            }

            $newBalance = $currentBalance - $days;

            // 1. Update Employee Leave Balance
            $updEmp = $this->pdo->prepare("UPDATE employees SET leave_balance = ? WHERE id = ?");
            $updEmp->execute([$newBalance, $empId]);

            // 2. Mark Request Approved
            $updReq = $this->pdo->prepare("UPDATE leave_requests SET status = 'Approved', approved_by = ? WHERE id = ?");
            $updReq->execute([$approvedBy, $leaveRequestId]);

            $this->pdo->commit();

            return [
                'leave_request_id' => $leaveRequestId,
                'status' => 'Approved',
                'employee_id' => $empId,
                'deducted_days' => $days,
                'remaining_balance' => $newBalance
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function clockAttendance(string $orgId, string $empId, string $status = 'Present'): array
    {
        $today = date('Y-m-d');
        $time = date('H:i:s');
        $id = 'att-' . bin2hex(random_bytes(6));

        $stmt = $this->pdo->prepare("
            INSERT OR REPLACE INTO attendance_records (id, organization_id, employee_id, date, check_in, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $orgId, $empId, $today, $time, $status]);

        return [
            'id' => $id,
            'employee_id' => $empId,
            'date' => $today,
            'check_in' => $time,
            'status' => $status
        ];
    }
}
