import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const topics = ['science', 'geography'];

const scienceQuestions = [
  { question: 'What planet is known as the Red Planet?', answer: 'Mars', difficulty: 'easy' },
  { question: 'What is the chemical symbol for gold?', answer: 'Au', difficulty: 'medium' },
  { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', difficulty: 'easy' },
];

const geographyQuestions = [
  { question: 'What is the capital of Australia?', answer: 'Canberra', difficulty: 'medium' },
  { question: 'Which river flows through Cairo?', answer: 'The Nile', difficulty: 'easy' },
];

const seedQuestions = {
  science: scienceQuestions,
  geography: geographyQuestions,
};

export async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
  )`);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM topics');
  if (rows[0].count > 0) return;

  for (const name of topics) {
    const result = await pool.query(
      'INSERT INTO topics (name) VALUES ($1) RETURNING id',
      [name]
    );
    const topicId = result.rows[0].id;

    for (const q of seedQuestions[name]) {
      await pool.query(
        'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
        [topicId, q.question, q.answer, q.difficulty]
      );
    }
  }
}