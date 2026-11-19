@echo off
chcp 65001 >nul
title Auditoría Forense - CICPC

:: 1. Calcular ruta absoluta de index.html y normalizar barras invertidas a barras inclinadas
set "GAME_PATH=%~dp0index.html"
set "GAME_URL=%GAME_PATH:\=/%"

:: 2. Buscar navegador compatible para modo aplicación limpia (Google Chrome o Microsoft Edge)
set "BROWSER="

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
    goto :LAUNCH
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
    goto :LAUNCH
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER=%LocalAppData%\Google\Chrome\Application\chrome.exe"
    goto :LAUNCH
)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
    goto :LAUNCH
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
    goto :LAUNCH
)

:: 3. Lanzamiento en ventana de aplicación independiente
:LAUNCH
if defined BROWSER (
    start "" "%BROWSER%" --app="file:///%GAME_URL%" --start-maximized --user-data-dir="%TEMP%\escape_room_cicpc_profile"
) else (
    start "" "%GAME_PATH%"
)

exit /b 0
