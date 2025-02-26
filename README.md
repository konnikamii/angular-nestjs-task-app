# Angular / NestJs Task App

<p align="center" style="display: flex; justify-content: center; align-items: center;">
  <a href="https://angular.dev/" rel="noopener noreferrer" target="_blank">
    <img src="https://platri.de/wp-content/uploads/2024/01/Angular-Framework-e1649312852136.png" height="120" alt="Angular Logo">
  </a>
  <a href="https://github.com/konnikamii/react-django-task-app" rel="noopener noreferrer" target="_blank" style="margin: 0px 10px 0px 20px ">
    <img src="https://lh4.googleusercontent.com/proxy/HEI87D1AFlNZgm7mlGYac67A98FXjWHakJdp1SJSC_AuHYMM6yD5TY-EYtwGPox2IvwdWQVYoIhb7wKYj5TQ_FkuvX5rhFoMtYizjCuv" width="40" alt="plus">
  </a>
  <a href="https://nestjs.com/" rel="noopener noreferrer" target="_blank">
    <img src="https://i.namu.wiki/i/X7RPRZJiL_bDk-b5yfaeCqEaINp3iwm7ngVhzN9LDg4hNjz0Bs3QTo7pgbCfGW3xp_sQZxMGUfnxBAXGNFwGKw.svg" width="140" alt="NestJs Logo">
  </a>
</p>

<table align="center" > 
  <tr> 
    <td>
      <a href="https://www.postgresql.org/" rel="noopener noreferrer" target="_blank">
        <img src="https://www.unixmen.com/wp-content/uploads/2017/07/postgresql-logo.png" height="50" alt="PostgreSQL Logo">
      </a>
    </td>
    <td>
      <a href="https://github.com/mailhog" rel="noopener noreferrer" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/10258541?s=200&v=4" height="50" alt="Mailhog Logo">
      </a>
    </td>
    <td>
      <a href="https://www.docker.com/" rel="noopener noreferrer" target="_blank">
        <img src="https://www.logo.wine/a/logo/Docker_(software)/Docker_(software)-Logo.wine.svg" height="100" alt="Docker Logo">
      </a>
    </td>
    <td>
      <a href="https://tagmanager.google.com/" rel="noopener noreferrer" target="_blank">
        <img src="https://img.icons8.com/color/512/google-tag-manager.png" height="50" alt="GTM Logo">
      </a>
      <a href="https://marketingplatform.google.com/about/analytics/" rel="noopener noreferrer" target="_blank">
        <img src="https://miro.medium.com/v2/resize:fit:1400/1*-ExxDAPl4rciaENKd8QSBw.png" height="60" alt="GA4 Logo">
      </a>
    </td>
  </tr>
</table>

## Description

This repository contains a full-stack task management platform application.

### Technologies Used

- **Backend**: NestJS (Node.js Framework)
- **Frontend**: Angular
- **Database**: PostgreSQL

### Additinal features include:

- **Mailhog** - email testing tool;
- **Backend End to End Testing**; 
- **GTM** and **Google Analytics 4** - setup for tracking cookies;
- **Dockerized**: Easy setup and deployment

---

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version **22** or higher) (if running locally)
- [npm](https://www.npmjs.com/) (version **10** or higher) (if running locally) 
- [Docker](https://www.docker.com/) (latest version)
- [Docker Compose](https://docs.docker.com/compose/) (latest version)

---

## Getting Started

#### 1. Make a folder where you will store the code:

```bash
mkdir angular-nestjs-task-app
```

#### 2. Clone the repository in the folder of your choice:

```bash
git clone https://github.com/konnikamii/angular-nestjs-task-app.git .
```

#### 3. Copy the example environment file and configure it:

```bash
cp .env.example .env
```

## Backend Setup

#### 1. Navigate to the backend directory:

```bash
cd backend
```

#### 2. Copy the example environment file and configure it:

```bash
cp .env.example .env
cp .env.example .env.test                               # setup for separate test DB
```

#### 3. Make new directories for the named volumes:

```bash
mkdir node_modules 
mkdir dist 
```

#### 4. Install Node.js dependencies using npm: (only if running locally)

```bash
npm install
```

#### 5. Run database migrations: (only if running locally)

```bash
npm run resetdb 
npm run seeddb                                          # optionally seed the db (uses ~/src/prisma/seed.ts)
```

#### 6. Start the development server: (only if running locally)

```bash
npm run dev
```

## Frontend Setup

#### 1. Navigate to the frontend directory:

```bash
cd frontend
```

#### 2. Copy the example environment file and configure it:

```bash
cp .env.example .env
```

#### 3. Make new directories for the named volumes:

```bash
mkdir node_modules 
mkdir dist 
```

#### 4. Install Node.js dependencies using npm: (only if running locally)

```bash
npm install
```

#### 5. Start the development server: (only if running locally)

```bash
npm run dev
```

## Docker Setup

#### 1. Navigate to the root directory:

```bash
cd ..
```

#### 2. Build and start the Docker containers:

```bash
docker compose up --build
```

### Access the application:

By default:

- The **frontend** will be available at [http://localhost:4200](http://localhost:4200)
- The **backend** will be available at [http://localhost:8000](http://localhost:8000)

Try creating an account and logging in.

---

### Additional Information:

- **Mailhog**:  
  Mailhog is included in the Docker setup to catch outgoing emails.  
  Access it at [http://localhost:8025](http://localhost:8025).

- **Database**:  
  The Docker setup includes a **PostgreSQL** database. Configure the connection in the `.env` file.

By default, the copied `.env` files should work when you run `docker compose up`.  
However, if any errors occur, ensure the correct **hostnames**, **ports**, and **credentials** are specified for **PostgreSQL** and **Mailhog**.  
Also, check the frontend and backend **hostnames** and **ports**.

If you want to start the **production build** run the following command:

```bash
docker compose -f docker-compose-prod.yaml up --build
```

To destroy containers use:

```bash
docker compose -f docker-compose-prod.yaml down
```

---

### Running Locally Without Docker:

You need the following:

- **PostgreSQL**:  
  Install **PostgreSQL** with its **GUI pgAdmin4** (optional) and create a database matching the name in your `.env` file.

  - Default port: `5432`
  - Ensure the `POSTGRES_PORT` from the `.env` file and **PostgreSQL** are on the same port.
  - You can use the default `postgres` user and set a new password.
  - Ensure the host environment variable matches your local DB hostname (e.g., `POSTGRES_HOST=127.0.0.1` or `POSTGRES_HOST=localhost`).

- **Mailhog**:  
  Install and configure Mailhog to run on the following ports:

  - SMTP: `1025`
  - HTTP: `8025`

  [Here is a helpful guide for Windows users](https://runcloud.io/blog/mailhog-email-testing).

---

If Mailhog isn't configured or you don't want it in your setup you can just skip it. The backend will ignore it if there is no connection and will not throw an exception.

### Testing

There are also test units included in the backend directory for some of the routes.
In order to run them make sure you can connect to the test DB first ,i.e. all `.env` variables are set correctly and execute the following script:

```bash 
npm run test:e2e 
```

You should see that all tests are successful. If not, something with the setup is incorrect.

#### GTM & GA4

If you want to connect your application to google services you need to create **GTM** account and **GA4** account. Then copy each of the unique IDs and replace them in your frontend `.env` file.

#### Helpfull commands for PostgreSQL

**Windows:**

```bash
pg_ctl status -D "C:\Program Files\PostgreSQL\[version]\data"  # checks the PostgreSQL process status
pg_ctl restart  -D "C:\Program Files\PostgreSQL\[version]\data"  # restart the PostgreSQL process
pg_ctl.exe register -N "PostgreSQL" -U "NT AUTHORITY\NetworkService" -D "C:\Program Files\PostgreSQL\[version]\data" -w  # creates a service to start on boot
```

**Linux:**

```bash
pg_ctl status -D /var/lib/postgresql/[version]/main  # checks the PostgreSQL process status
pg_ctl restart -D /var/lib/postgresql/[version]/main  # restart the PostgreSQL process
pg_ctl start -D /var/lib/postgresql/[version]/main  # start the PostgreSQL process
pg_ctl stop -D /var/lib/postgresql/[version]/main  # stop the PostgreSQL process
```
#### Helpfull commands for Docker
 
```bash
docker compose up                                                 # builds images and starts the containers (dafaults to: ./docker-compose.yaml ./.env)
docker compose down                                               # removes containers
docker compose config                                             # troubleshoots the setup

docker compose up --build                                         # forces image rebuilds
docker compose --project-name "my-app" up                         # flag for setting project name (if not specified)
docker compose -p "my-app" up                                     # shorthand for project name
docker compose -f <filename.yaml> up                              # runs a particular 'docker-compose.yaml' file
  
docker ps                                                         # lists all containers
docker logs <container_name_or_id>                                # check logs of container
docker stats                                                      # tracks active container resource utilization

docker exec -it <container_name_or_id> /bin/sh                    # enter container using shell
docker exec -it <container_name_or_id> bash                       # enter container using bash (if installed)
```