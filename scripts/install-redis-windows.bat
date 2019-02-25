@echo off
if exist scripts/redis-installed (
	echo "Redis is already installed."
) else (
	echo "Installing Redis..."
	msiexec /i "%cd%\bin\Redis-x64-3.2.100.msi" || goto:failure
	echo "Successfully installed Redis."
	type NUL > scripts/redis-installed
)
goto:eof

:failure
	echo "Could not install Redis."


