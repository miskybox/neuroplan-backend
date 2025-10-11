@echo off
echo ========================================
echo   TEST N8N WEBHOOK - NeuroPlan
echo ========================================
echo.
echo Enviando datos de prueba al webhook...
echo.

curl -X POST ^
  https://cibermarginales.app.n8n.cloud/webhook-test/f56a08ce-ff8d-4bf3-a91d-00439cf3ad2d ^
  -H "Content-Type: application/json" ^
  -d "{\"workflowName\":\"pei-generated\",\"executionId\":\"test-123\",\"priority\":\"normal\",\"timestamp\":\"2025-10-11T20:30:00.000Z\",\"peiId\":\"test-pei-456\",\"studentId\":\"student-789\",\"studentName\":\"Juan Perez\",\"studentGrade\":\"5to Basico\",\"parentEmail\":\"padre@example.com\",\"school\":\"Escuela Demo\",\"peiSummary\":\"PEI de prueba generado para estudiante con TDAH...\"}"

echo.
echo.
echo ========================================
echo   Test completado
echo ========================================
pause
