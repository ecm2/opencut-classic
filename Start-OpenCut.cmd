@echo off
node "%~dp0script\start-local.cjs" %*
if errorlevel 1 pause
