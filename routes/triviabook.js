import { Router } from 'express';
import {
    listTopics,
    listQuestions,
    getRandom,
    checkAnswer,
    addQuestion,
} from '../controllers/triviabook.js';

const router = Router();

router.get('/topics', listTopics);
router.get('/topic/:topic', listQuestions);
router.get('/random', getRandom);
router.post('/answer', checkAnswer);
router.post('/question/add', addQuestion);

export default router;