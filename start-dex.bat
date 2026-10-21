@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          ObfuscatedSwap DEX Interface Launcher            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Starting the DEX interface...
echo.

cd web

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo ✅ Opening DEX interface at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
