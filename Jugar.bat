@echo off
setlocal

:: abrir el juego en pantalla completa
set "GAME_PATH=%~dp0index.html"

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%GAME_PATH%" --start-maximized --user-data-dir="%TEMP%\escape_room_cicpc_profile"
    exit /b 0
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%GAME_PATH%" --start-maximized --user-data-dir="%TEMP%\escape_room_cicpc_profile"
    exit /b 0
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --app="%GAME_PATH%" --start-maximized --user-data-dir="%TEMP%\escape_room_cicpc_profile"
    exit /b 0
)

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%GAME_PATH%" --start-maximized --user-data-dir="%TEMP%\escape_room_cicpc_profile"
    exit /b 0
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="%GAME_PATH%" --start-maximized --user-data-dir="%TEMP%\escape_room_cicpc_profile"
    exit /b 0
)

start "" "%GAME_PATH%"
exit /b 0