import { pool } from '../db.js';

export async function listTopics() {
    const { rows } = await pool.query('SELECT name FROM topics ORDER BY name');
    return rows.map((row) => row.name);
}

export async function findTopic(name) {
    const { rows } = await pool.query(
        'SELECT id, name FROM topics WHERE name = $1',
        [name.trim().toLowerCase()]
    );
    return rows[0];
}

export async function listQuestions(topicId, { difficulty, limit } = {}) {
    const params = [topicId];
    let sql = `SELECT q.id, t.name AS topic, q.question, q.answer, q.difficulty
             FROM questions q JOIN topics t ON t.id = q.topic_id
             WHERE q.topic_id = $1`;

    if (difficulty) {
        params.push(difficulty);
        sql += ` AND q.difficulty = $${params.length}`;
    }
    sql += ' ORDER BY q.id';
    if (limit) {
        params.push(limit);
        sql += ` LIMIT $${params.length}`;
    }

    const { rows } = await pool.query(sql, params);
    return rows;
}

export async function randomQuestion() {
    const { rows } = await pool.query(
        `SELECT q.id, t.name AS topic, q.question, q.difficulty
     FROM questions q JOIN topics t ON t.id = q.topic_id
     ORDER BY RANDOM() LIMIT 1`
    );
    return rows[0];
}

export async function findQuestion(id) {
    const { rows } = await pool.query(
        'SELECT id, answer FROM questions WHERE id = $1',
        [id]
    );
    return rows[0];
}

export async function createQuestion({ topic, question, answer, difficulty }) {
    let existing = await findTopic(topic);

    if (!existing) {
        const result = await pool.query(
            'INSERT INTO topics (name) VALUES ($1) RETURNING id, name',
            [topic.trim().toLowerCase()]
        );
        existing = result.rows[0];
    }

    await pool.query(
        'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
        [existing.id, question, answer, difficulty]
    );
    return existing.id;
}