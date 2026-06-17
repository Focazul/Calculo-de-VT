@echo off
REM Gestão de Vale-Transporte (VT) - Iniciar Script
REM Este script inicia o servidor backend e frontend, e abre o navegador automaticamente

REM Navegar para a pasta do script (pasta do projeto)
cd /d "%~dp0"

echo.
echo ========================================
echo Gestão de Vale-Transporte (VT)
echo ========================================
echo.
echo Pasta do projeto: %cd%
echo.

REM Verificar se pnpm está instalado
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo Erro: pnpm não está instalado ou não está no PATH
    echo Por favor, instale pnpm globalmente: npm install -g pnpm
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Erro: Node.js não está instalado ou não está no PATH
    echo Por favor, instale Node.js em https://nodejs.org/
    pause
    exit /b 1
)

echo Iniciando Gestão de Vale-Transporte...
echo.

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo Instalando dependências...
    call pnpm install
    echo.
)

REM Iniciar o servidor de desenvolvimento
echo Iniciando servidor de desenvolvimento...
echo Aguarde alguns segundos para o servidor iniciar...
echo.

REM Iniciar o servidor em background
start "Gestão VT - Servidor" cmd /k "pnpm run dev"

REM Aguardar o servidor iniciar
echo Aguardando servidor iniciar na porta 3000...
timeout /t 8 /nobreak

REM Abrir o navegador
echo Abrindo navegador em http://localhost:3000...
start http://localhost:3000

echo.
echo ========================================
echo Servidor iniciado com sucesso!
echo Acesse http://localhost:3000 no seu navegador
echo Para parar o servidor, feche a janela do terminal
echo ========================================
echo.

pause
