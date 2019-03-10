FOR /F "tokens=5 delims= " %%P IN ('netstat -ano ^| find "LISTENING" ^| find ":80 "') DO (TASKKILL /PID %%P /F)
FOR /F "tokens=5 delims= " %%P IN ('netstat -ano ^| find "FIN_WAIT_2" ^| find ":80 "') DO (TASKKILL /PID %%P /F)
FOR /F "tokens=5 delims= " %%P IN ('netstat -ano ^| find "CLOSE_WAIT" ^| find ":80 "') DO (TASKKILL /PID %%P /F)
FOR /F "tokens=5 delims= " %%P IN ('netstat -ano ^| find "TIME_WAIT" ^| find ":80 "') DO (TASKKILL /PID %%P /F)