# Wallet Service API

A RESTful wallet service built with Node.js, Express, PostgreSQL, and Docker.

## Features

- Credit Wallet ( idempotent)
- Purchase Item  (idempotent)
- Transaction History
- Idempotent Reward API
- Wallet Details 
- PostgreSQL Database
- Dockerized Application
- Jest Integration Tests


## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Docker
- Docker Compose
- Jest
- Supertest

## Prerequisites

Install the following before running the project.

- Docker
- Docker Compose

## Set up

1. Clone the repository

```bash
git clone https://github.com/raviprakash283/Asphalt-nitro
```
---


## Running with Docker

Build the containers.

```bash
docker compose build
```

Start the application.

```bash
docker compose up
```

Run in detached mode.

```bash
docker compose up -d
```

Stop containers.

```bash
docker compose down
```

---

## Running Test cases with docker 

Run integration test cases 

```bash
docker compose exec app npm run test:wallet
```

----



### API end points (wallets)

| Method | Endpoint                    |     Body
|---------|----------------------------|--------------
| GET | v1/wallets/{playerId}          |
| POST | v1/wallets/{playerId}/credit  | { "amount" : int >0 , "reason : str"}
| POST | /wallets/{playerId}/purchase  | {  "itemId" : int , "price": int >0 }

---

#   API end points (rewards)

| Method | Endpoint                    |     Body
|---------|----------------------------|--------------
| POST | v1/rewards/{rewardId}/claim  | { "playerId" : int }