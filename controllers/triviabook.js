import * as model from '../models/triviabook.js';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const isFilled = (value) => typeof value === 'string' && value.trim() !== '';

export async function listTopics(req, res, next) {
    try {
        res.json(await model.listTopics());
    } catch (err) {
        next(err);
    }
}

export async function listQuestions(req, res, next) {
    try {
        const { limit, difficulty } = req.query;

        if (difficulty !== undefined && !DIFFICULTIES.includes(difficulty)) {
            return res.status(400).json({ error: 'difficulty must be easy, medium, or hard' });
        }

        let parsedLimit;
        if (limit !== undefined) {
            parsedLimit = Number(limit);
            if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
                return res.status(400).json({ error: 'limit must be a positive integer' });
            }
        }

        const topic = await model.findTopic(req.params.topic);
        if (!topic) {
            return res.status(404).json({ error: `Topic "${req.params.topic}" not found` });
        }

        res.json(await model.listQuestions(topic.id, { difficulty, limit: parsedLimit }));
    } catch (err) {
        next(err);
    }
}

export async function getRandom(req, res, next) {
    try {
        const question = await model.randomQuestion();
        if (!question) {
            return res.status(404).json({ error: 'No questions in the database' });
        }
        res.json(question);
    } catch (err) {
        next(err);
    }
}

export async function checkAnswer(req, res, next) {
    try {
        const { id, guess } = req.body ?? {};

        if (id === undefined || id === null || !isFilled(guess)) {
            return res.status(400).json({ error: 'id and guess are required' });
        }
        const questionId = Number(id);
        if (!Number.isInteger(questionId)) {
            return res.status(400).json({ error: 'id must be an integer' });
        }

        const question = await model.findQuestion(questionId);
        if (!question) {
            return res.status(404).json({ error: `Question ${questionId} not found` });
        }

        const correct = guess.trim().toLowerCase() === question.answer.trim().toLowerCase();
        res.json({ correct, answer: question.answer });
    } catch (err) {
        next(err);
    }
}

export async function addQuestion(req, res, next) {
    try {
        const { topic, question, answer, difficulty } = req.body ?? {};

        if (![topic, question, answer, difficulty].every(isFilled)) {
            return res.status(400).json({
                error: 'topic, question, answer, and difficulty are required',
            });
        }
        if (!DIFFICULTIES.includes(difficulty)) {
            return res.status(400).json({ error: 'difficulty must be easy, medium, or hard' });
        }

        const topicId = await model.createQuestion({
            topic,
            question: question.trim(),
            answer: answer.trim(),
            difficulty,
        });
        res.status(201).json(await model.listQuestions(topicId));
    } catch (err) {
        next(err);
    }
}