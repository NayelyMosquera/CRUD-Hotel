# Proyecto Docker para Aplicación Full-Stack

Este proyecto contiene una aplicación full-stack que incluye un backend y un frontend, ambos ejecutándose en contenedores Docker. A continuación se detallan las instrucciones para construir y ejecutar los contenedores.

## Estructura del Proyecto

```
CRUD_APP
├── backendAPI-main
│   ├── Dockerfile
│   ├── config
│   |   └── db.js
│   ├── controllers
│   |   └── HotelDataController.js
│   |   └── UserController.js
│   ├── helpers
│   |   └── MongoHelper.js
│   |   └── Response.js
│   ├── middleware
│   |   └── Auth.js
│   ├── node_module
│   |   └── todas las dependencias
│   ├── routes
│   |   └── User.js
│   ├── utils
│   |   └── generateOtp.js
│   |   └── Token.js
│   |   └── uploadS3.js
│   └── package.json
│   └── package-lock.json
│   └── Dockerfile.backend
│   └── index.js
├── reservaHotelFrontend
│   ├── .angular\cache\16.2.10
│   │   └── los archivos de cache
│   ├── .vscode
│   │   └── los archivos de configuración
│   ├── node_module
│   |   └── todas las dependencias
│   ├── src
│   │   └── app
│   │   |   └── components\login
│   │   |   |   └── auth.servicr.spec.ts
│   │   |   |   └── auth.service.ts
│   │   |   |   └── login.component.css
│   │   |   |   └── login.component.html
│   │   |   |   └── login.component.spec.ts
│   │   |   |   └── login.component.ts
│   │   |   |   └── notification.service.ts
│   │   |   |   └── notifications.component.ts
│   │   |   └── inicio
│   │   |   │   └── inicio.component.css
│   │   |   │   └── inicio.component.html
│   │   |   │   └── inicio.component.spec.ts
│   │   |   │   └── inicio.component.ts
│   │   |   └── interceptors
│   │   |   │   └── htt-request.interceptor.ts
│   │   |   └── services
│   │   |   │   └── auth.service.ts
│   │   |   └── app-routing.mudule,ts
│   │   |   └── app.component.css
│   │   |   └── app.component.html
│   │   |   └── app.component.spec.ts
│   │   |   └── app.component.ts
│   │   |   └── app.module.ts
│   │   └── assets
│   │   |   └── los archivos de assets
│   │   └── environments
│   │   |   └── environment.ts
│   │   |   └── environment.prod.ts
│   │   └── index.html
│   │   └── main.ts
│   │   └── styles.css esta vacio
│   │   └── Karma.conf.js Esta vacio 
│   └── package.json
│   └── package-lock.json
│   └── tsconfig.json
│   └── tsconfig.app.json
│   └── tsconfig.spec.json
│   └── angular.json
│   └── Dockerfile.frontend
│   └── nginx.conf
│   └── .editorconfig
│   └── .gitignore
├── docker-compose.yml
└── README.md
```

## Requisitos Previos

- Tener Docker y Docker Compose instalados en tu máquina.

## Construcción de los Contenedores

Para construir los contenedores, navega a la raíz del proyecto y ejecuta el siguiente comando:

```
docker-compose build
```

## Ejecución de los Contenedores

Para iniciar los servicios del backend y del frontend, utiliza el siguiente comando:

```
docker-compose up
```

Esto levantará ambos contenedores y podrás acceder a la aplicación en tu navegador.

## Acceso a la Aplicación

- El frontend estará disponible en `http://localhost:3000` (puede variar según la configuración en `docker-compose.yml`).
- El backend estará disponible en `http://localhost:5000` (puede variar según la configuración en `docker-compose.yml`).

## Detener los Contenedores

Para detener los contenedores en ejecución, presiona `Ctrl + C` en la terminal donde ejecutaste `docker-compose up`, o ejecuta:

```
docker-compose down
```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor abre un issue o un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.