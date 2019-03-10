@echo off
title Care Portal
color 1f
echo Welcome to Care Portal

start cmd /k "C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe"

cmd /c "forever cleanlogs"

start cmd /k "forever -o out.log -e err.log ./bin/www"

echo Opening your favourite browser
timeout 8

start /wait http://localhost:3000