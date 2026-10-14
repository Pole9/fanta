@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo Sincronizzazione Wiki su GitHub (Pole9/fanta.wiki.git)
echo ========================================================
echo.
echo NOTA: Su GitHub la Wiki deve essere prima abilitata:
echo Vai su https://github.com/Pole9/fanta/settings -> Features -> Wikis (spunta attiva)
echo Poi apri la scheda "Wiki" e fai clic su "Create the first page".
echo.

set WIKI_DIR=%TEMP%\fanta_wiki_clone_%RANDOM%
set REPO_URL=https://Pole9@github.com/Pole9/fanta.wiki.git

echo Clonazione repository wiki temporaneo...
git clone %REPO_URL% "%WIKI_DIR%"
if errorlevel 1 (
    echo.
    echo [ERRORE] Impossibile clonare la wiki.
    echo Assicurati di aver creato la prima pagina sulla wiki di GitHub via web:
    echo https://github.com/Pole9/fanta/wiki
    pause
    exit /b 1
)

echo.
echo Copia file da wiki/ a repository wiki...
copy /Y wiki\*.md "%WIKI_DIR%\"

cd /d "%WIKI_DIR%"
git add .
git commit -m "Aggiornata documentazione wiki completa FantaAsta Live Master"
git push origin master
if errorlevel 1 (
    git push origin main
)

cd /d "%~dp0\.."
rmdir /S /Q "%WIKI_DIR%"

echo.
echo ========================================================
echo Wiki sincronizzata con successo su GitHub!
echo https://github.com/Pole9/fanta/wiki
echo ========================================================
pause
