@echo off
echo ========================================
echo AI Scrum Master Environment Validator
echo ========================================
echo.

cd /d "%~dp0"

echo Checking backend environment...
if exist "backend\.env" (
    echo ✅ backend/.env found
    echo.

    echo 🔍 Checking required environment variables:

    REM Check OpenAI API Key
    findstr /C:"OPENAI_API_KEY=" backend\.env >nul 2>&1
    if %errorlevel% equ 0 (
        findstr /C:"OPENAI_API_KEY=\"your" backend\.env >nul 2>&1
        if %errorlevel% equ 0 (
            echo ❌ OPENAI_API_KEY: Still using placeholder value
        ) else (
            echo ✅ OPENAI_API_KEY: Configured
        )
    ) else (
        echo ❌ OPENAI_API_KEY: Not found
    )

    REM Check Pinecone API Key
    findstr /C:"PINECONE_API_KEY=" backend\.env >nul 2>&1
    if %errorlevel% equ 0 (
        findstr /C:"PINECONE_API_KEY=\"your" backend\.env >nul 2>&1
        if %errorlevel% equ 0 (
            echo ❌ PINECONE_API_KEY: Still using placeholder value
        ) else (
            echo ✅ PINECONE_API_KEY: Configured
        )
    ) else (
        echo ❌ PINECONE_API_KEY: Not found
    )

    REM Check Database URL
    findstr /C:"DATABASE_URL=" backend\.env >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ DATABASE_URL: Configured
    ) else (
        echo ❌ DATABASE_URL: Not found
    )

    REM Check JWT Secrets
    findstr /C:"JWT_SECRET=" backend\.env >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ JWT_SECRET: Configured
    ) else (
        echo ❌ JWT_SECRET: Not found
    )

) else (
    echo ❌ backend/.env not found
)

echo.
echo Checking frontend environment...
if exist "frontend\frontend\.env.local" (
    echo ✅ frontend/frontend/.env.local found

    findstr /C:"NEXT_PUBLIC_API_URL=" frontend\frontend\.env.local >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ NEXT_PUBLIC_API_URL: Configured
    ) else (
        echo ❌ NEXT_PUBLIC_API_URL: Not found
    )
) else (
    echo ❌ frontend/frontend/.env.local not found
)

echo.
echo ========================================
echo Next Steps:
echo 1. Get your OpenAI API key from: https://platform.openai.com/api-keys
echo 2. Get your Pinecone API key from: https://www.pinecone.io/
echo 3. Update the placeholder values in backend/.env
echo 4. Run: make install (or docker-compose up -d)
echo ========================================
pause