@echo off
echo ========================================
echo   SECURITY FIX: Hide API Key
echo ========================================
echo.

cd /d "%~dp0"

git add FINAL_SUMMARY_100_PERCENT.md
git commit -m "security: Hide ElevenLabs API key from documentation"
git push

echo.
echo ========================================
echo   Done! Key hidden from public repo
echo ========================================
echo.
echo IMPORTANT: You MUST regenerate the API key in ElevenLabs
echo Go to: https://elevenlabs.io/app/settings/api-keys
echo.
pause
