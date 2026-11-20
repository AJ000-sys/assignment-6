# Assignment 6: Triviabook

A full-stack application with a Node/Express backend that uses Postgres to design an appropriate relational database to store the data.

**Live URL:** https://assignment-6-pffc.onrender.com

## Database Schema

**topics**

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| name | TEXT | Required, unique (stored in lowercase) |

**questions**

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| topic_id | INTEGER | Required, foreign key to `topics(id)` |
| question | TEXT | Required |
| answer | TEXT | Required |
| difficulty | TEXT | Required, must be `easy`, `medium`, or `hard` |

One topic has many questions. The tables are created automatically when the server starts, and the starting questions (science and geography) are added if the database is empty.

## Setup

1. Clone the repository and run `npm install`.
2. Create a Neon Postgres project and copy its connection string.
3. Create a `.env` file in the project root:
   ```
   DATABASE_URL='your-neon-connection-string'
   ```
4. Run `npm start`. The server listens on port 3000 (or `PORT` if set).

On Render, set `DATABASE_URL` in the service's Environment settings and use `node server.js` as the start command.

## Endpoints

All routes begin with `/triviabook`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/triviabook/topics` | List all topics |
| GET | `/triviabook/topic/:topic` | Questions in a topic. Optional query parameters: `limit` (positive integer) and `difficulty` (`easy`, `medium`, `hard`). Returns 404 for an unknown topic and 400 for invalid parameters. |
| GET | `/triviabook/random` | One random question, without the answer |
| POST | `/triviabook/answer` | Body: `{ "id": 1, "guess": "mars" }`. Returns `{ "correct": true, "answer": "Mars" }`. Returns 400 if a field is missing and 404 if the question does not exist. |
| POST | `/triviabook/question/add` | Body: `{ "topic", "question", "answer", "difficulty" }`. Creates the topic if needed and returns the updated list of questions for that topic (201). Returns 400 if a field is missing or `difficulty` is invalid. |