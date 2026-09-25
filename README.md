# Panaderia La Espiga

Aplicacion web fullstack para una panaderia. El frontend usa React + Vite, la API usa Express y los datos se almacenan en MySQL con un volumen Docker.

## Tecnologias

- React + Vite
- Express + Node.js
- MySQL 8.4
- Docker Compose
- Volumen nombrado `panaderia_mysql_data`

## Ejecutar con Docker

Requisito: Docker Desktop abierto.

```bash
docker compose up --build
```

Abrir http://localhost:5173

API: http://localhost:3000/api/health

## Comandos utiles

```bash
docker compose ps
docker compose logs -f
docker compose down
docker compose down -v
```

`docker compose down` conserva los datos. `docker compose down -v` elimina tambien el volumen y reinicia la base de datos desde cero.

## Ejecutar sin Docker

1. Inicia MySQL local y ejecuta `database/init.sql`.
2. En `backend`, ejecuta `npm install` y `npm start`.
3. En `frontend`, ejecuta `npm run dev`.

## Subir a GitHub

```bash
git init
git add .
git commit -m "feat: crear aplicacion de panaderia con React y Docker"
git branch -M main
git remote add origin https://github.com/Gaforsix777/PanaderiaDocker.git
git push -u origin main
```

Si el repositorio remoto ya tiene commits, primero usa `git pull --rebase origin main`.

## Prompts documentados

Los prompts usados para orientar el desarrollo estan en `docs/prompts.md`.

La guia paso a paso para demostrar Docker y tomar capturas esta en `docs/demostracion-docker.md`.
