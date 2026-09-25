# Demostracion de Docker: Panaderia La Espiga

Este documento sirve como evidencia del proceso realizado con Docker. La aplicacion ya funciona; estos pasos solo sirven para mostrar y documentar el proceso.

## 1. Preparar Docker Desktop

Abrir Docker Desktop y verificar que el motor indique **Running**.

Abrir PowerShell en la carpeta del proyecto:

```powershell
cd C:\Users\victus\Downloads\TrabajoPanaderia
```

**Captura 1:** Docker Desktop abierto y el proyecto ubicado en la terminal.

**Explicacion:** Docker Desktop es el programa que ejecuta los contenedores. PowerShell debe estar ubicado en la carpeta donde existe `docker-compose.yml`.

## 2. Revisar la configuracion

Ejecutar:

```powershell
docker compose config
```

**Captura 2:** La salida del comando mostrando los servicios `database`, `backend`, `frontend` y el volumen `mysql_data`.

**Explicacion:** Este comando verifica que Docker Compose pueda interpretar correctamente la configuracion antes de crear los contenedores.

## 3. Construir las imagenes y crear los servicios

Ejecutar:

```powershell
docker compose up --build -d
```

Significado:

- `up`: crea e inicia los servicios.
- `--build`: construye las imagenes usando los Dockerfile.
- `-d`: deja los contenedores ejecutandose en segundo plano.

**Captura 3:** La salida donde aparezcan las imagenes construidas, la red, el volumen y los tres contenedores creados.

**Explicacion:** Compose construye una imagen para el frontend React y otra para el backend Express. MySQL utiliza la imagen oficial `mysql:8.4`.

## 4. Mostrar los contenedores activos

Ejecutar:

```powershell
docker compose ps
```

Debe aparecer algo parecido a:

```text
panaderia-db   Up ... (healthy)
panaderia-api  Up ...
panaderia-web  Up ...
```

**Captura 4:** La terminal mostrando los tres servicios activos y sus puertos.

**Explicacion:**

- `panaderia-db`: base de datos MySQL.
- `panaderia-api`: API creada con Express.
- `panaderia-web`: frontend React servido por Nginx.
- `healthy`: el healthcheck confirmó que MySQL acepta conexiones.

## 5. Mostrar las imagenes creadas

Ejecutar:

```powershell
docker images
```

Buscar estas imagenes:

```text
trabajopanaderia-frontend
trabajopanaderia-backend
mysql:8.4
```

**Captura 5:** Docker Desktop en la sección Images o la salida de `docker images`.

**Explicacion:** Una imagen es la plantilla desde la que se crean los contenedores. El contenedor es la instancia que se está ejecutando.

## 6. Mostrar el volumen de datos

Ejecutar:

```powershell
docker volume ls
```

Debe aparecer:

```text
panaderia_mysql_data
```

Para mostrar más detalle:

```powershell
docker volume inspect panaderia_mysql_data
```

**Captura 6:** Docker Desktop en Volumes mostrando `panaderia_mysql_data`.

**Explicacion:** El volumen está conectado a `/var/lib/mysql` dentro del contenedor. Por eso los datos no desaparecen al detener o recrear el contenedor.

## 7. Probar la pagina web

Abrir en el navegador:

```text
http://localhost:5173
```

**Captura 7:** La pagina de La Espiga mostrando el catalogo de productos.

**Explicacion:** El puerto `5173` del equipo se conecta con el puerto `80` del contenedor frontend.

## 8. Probar la API

Abrir:

```text
http://localhost:3000/api/health
```

Debe responder:

```json
{"status":"ok","database":"connected"}
```

También se puede probar el catálogo:

```text
http://localhost:3000/api/products
```

**Captura 8:** La respuesta JSON con `database: connected` o la lista de productos.

**Explicacion:** La API Express está conectada a MySQL usando el nombre del servicio Docker `database`, no `localhost`. Docker Compose crea una red interna para que los servicios se comuniquen.

## 9. Mostrar la base de datos dentro del contenedor

Ejecutar:

```powershell
docker exec panaderia-db mysql -upanadero -ppanadero_pass -D panaderia -e "SHOW TABLES; SELECT COUNT(*) AS productos FROM products;"
```

**Captura 9:** La terminal mostrando las tablas y la cantidad de productos.

**Explicacion:** `database/init.sql` crea las tablas `products` y `orders`, además de cargar los productos iniciales.

## 10. Evidenciar la persistencia

Para demostrar que el volumen conserva información, primero revisar los datos:

```powershell
docker exec panaderia-db mysql -N -s -upanadero -ppanadero_pass -D panaderia -e "SELECT COUNT(*) FROM products;"
```

Después reiniciar los servicios:

```powershell
docker compose restart database backend
```

Esperar unos segundos y revisar el estado:

```powershell
docker compose ps
```

Finalmente volver a consultar:

```powershell
docker exec panaderia-db mysql -N -s -upanadero -ppanadero_pass -D panaderia -e "SELECT COUNT(*) FROM products;"
```

**Captura 10:** El mismo número de productos antes y después del reinicio.

**Explicacion:** El contenedor se reinició, pero los datos permanecieron porque MySQL utiliza el volumen `panaderia_mysql_data`.

## 11. Apagar el proyecto sin borrar los datos

```powershell
docker compose down
```

Este comando detiene y elimina los contenedores, pero conserva el volumen.

Para volver a iniciar:

```powershell
docker compose up -d
```

**Captura 11:** Docker Desktop sin los contenedores activos y después de volver a iniciarlos.

## Importante: comando que no se debe usar en la demostracion

No ejecutar:

```powershell
docker compose down -v
```

La opción `-v` elimina el volumen y borra los datos de MySQL. Solo se utiliza si se quiere reiniciar la base de datos completamente desde cero.

## Resumen de la arquitectura

```text
Navegador
   |
   | http://localhost:5173
   v
panaderia-web (React + Vite compilado y Nginx)
   |
   | /api por la red interna de Docker
   v
panaderia-api (Node.js + Express)
   |
   v
panaderia-db (MySQL 8.4)
   |
   v
panaderia_mysql_data (volumen persistente)
```

## Prompts usados con la IA

### Prompt 1: idea inicial

> Actua como un desarrollador fullstack. Necesito crear desde cero una pagina web de panaderia usando Docker, volumenes para datos, Dockerfile y Docker Compose. La aplicacion debe quedar lista para subir al repositorio PanaderiaDocker.

### Prompt 2: frameworks

> Usa React + Vite para el frontend, Express para la API y MySQL como base de datos. Conecta los servicios mediante Docker Compose y conserva la informacion con un volumen nombrado.

### Prompt 3: funcionalidad

> Crea un catalogo de productos de panaderia con categorias, buscador, carrito y formulario para enviar pedidos. Agrega endpoints para consultar productos y guardar pedidos.

### Prompt 4: Docker

> Configura Dockerfile para frontend y backend, Docker Compose con React, Express y MySQL, un volumen persistente para MySQL y un script init.sql para crear las tablas y datos iniciales.

### Prompt 5: documentacion

> Documenta paso a paso los comandos usados, las capturas que debo tomar, el funcionamiento de los contenedores, el volumen de datos, los prompts utilizados y la forma de subir el proyecto a GitHub.

## Subir el proyecto a GitHub

El proyecto se publico en:

```text
https://github.com/Gaforsix777/PanaderiaDocker.git
```

Comandos usados:

```powershell
git init
git add .
git commit -m "feat: crear aplicacion de panaderia con React y Docker"
git branch -M main
git remote add origin https://github.com/Gaforsix777/PanaderiaDocker.git
git push -u origin main
```
