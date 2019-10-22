# MINGESO - Front

## 1. Frameworks Utilizados

- VueJS 2.6
- Bootstrap 4.3

## 2. Requerimientos

### 2.1 Requerimientos mínimos en el servidor

- Memoria ram 512MB
- 1 vCPU
- 1 GB SSD

### 2.2 Técnicos

- Node >= 8.9.0
- Npm >= 5.5.1

## 3. Instalación Desarrollo

Se debe buscar el directorio raíz, donde se hosteara el proyecto, ejemplo:

    cd /var/www/

Una vez ahí, se debe clonar el repositorio perteneciente al proyecto, este proyecto está bajo el software de control de versiones llamado git y hospedado en github.com, para clonar el repositorio se debe ejecutar el siguiente comando,

    git clone https://github.com/braulioUsach/mingeso-hotel-web

> Este comando te pedirá autenticación, deberás autenticarte con tu usuario y clave.

Una vez autenticado comenzara la clonación del repositorio. Este repositorio contiene el proyecto, sin las librerías externas de JavaScript utilizadas, por ende, se debe a proceder a instalarlas de la forma que se describe a continuación:

Cuando esté el repositorio clonado, se deberá ingresar a él, está ubicado en el directorio `mingeso-hotel-web` que se acabó de crear al ejecutar el comando anterior.

    cd migeso-hotel-web

Una vez dentro del directorio, se deberá copiar el archivo .env.example a .env y editar las variables de configuraciones iniciales dentro de .env:

```
cp .env.example .env
```

Luego, la instalación de las librerias JS necesarias:

```
npm install
```

### Compilando para desarrollo

```
npm run serve
```

### Compilando para producción

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

## 4. Docker

### 4.1 Construyendo el Docker

Vaya a la carpeta del proyecto en una ventana de terminal, luego ejecute el siguiente comando para construir el contenedor y etiquetarlo como mingeso-hotel-web

`docker build -t mingeso-hotel-web .`

Luego ejecute el contenedor separado de la ventana de terminal, asigne el nombre a mingeso-hotel-web y abra el puerto 80.

`docker run -i -d -p 80:80 --name mingeso-hotel-web mingeso-hotel-web`

Tenga en cuenta que esta compilación es para fines de desarrollo, no ejecuta la aplicación compilada dentro de la carpeta dist, por lo que se espera un contenedor grande.

### 4.2 Reconstruyendo el Docker

Sigue estos pasos:

1.  Detener el contenedor `docker stop mingeso-hotel-web`
2.  Retirar el contenedor `docker rm mingeso-hotel-web`
3.  Obtener cambios de código `git fetch`
4.  Cambios de código de extracción `git pull`
5.  Crear y ejecutar el nuevo contenedor (sección anterior)

Atajo: `docker stop mingeso-hotel-web && docker rm mingeso-hotel-web && git fetch && git pull && docker build -t mingeso- . && docker run -i -d -p 80:80 --name mingeso-hotel-web mingeso-hotel-web`

### 4.3 Reconstruyendo el Docker en Producción

Atajo: `docker pull braulioUsach/mingeso-hotel-web && docker stop mingeso-hotel-web && docker rm mingeso-hotel-web && docker run -it -d -p 80:80 --name mingeso-hotel-web braulioUsach/mingeso-hotel-web`

### 4.4 Docker swarm

Ejecuta el siguiente comando si estas ejecutando docker swarm

`docker service create --name mingeso-hotel-web --constraint "node.role==manager" --publish=80:80 braulioUsach/mingeso-hotel-web:latest`

## 5. Soporte

¿ayuda?

- braulio.castro@usach.cl
