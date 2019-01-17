@echo off
if exist redis/redis-installed (
	echo "Redis is already installed."
) else (
	echo "Installing Redis..."
	msiexec /i "%cd%\redis\Redis-x64-3.2.100.msi" || goto:failure
	echo "Successfully installed."
	type NUL > redis/redis-installed
)
goto:eof

:failure
	echo "Could not install."


