const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Test uchun tasodifiy savollarni olish
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Savollar soni
 *     responses:
 *       200:
 *         description: Tasodifiy savollar ro'yxati (to'g'ri javobsiz)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   questionText:
 *                     type: string
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Tasodifiy savollarni olish va correctAnswerIndex ni olib tashlash
    const questions = await Question.aggregate([
      { $sample: { size: limit } },
      { 
        $project: { 
          questionText: 1, 
          options: 1,
          _id: 1
        } 
      }
    ]);
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /submit:
 *   post:
 *     summary: Test javoblarini yuborish va natijani olish
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       description: Savol ID si
 *                     selectedAnswer:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 3
 *                       description: Tanlangan javob indeksi
 *     responses:
 *       200:
 *         description: Test natijalari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalQuestions:
 *                   type: integer
 *                   description: Jami savollar soni
 *                 correctAnswers:
 *                   type: integer
 *                   description: To'g'ri javoblar soni
 *                 score:
 *                   type: number
 *                   description: Foizda ball
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionId:
 *                         type: string
 *                       questionText:
 *                         type: string
 *                       selectedAnswer:
 *                         type: integer
 *                       correctAnswer:
 *                         type: integer
 *                       isCorrect:
 *                         type: boolean
 */
router.post('/', async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Javoblar massivi talab qilinadi' });
    }

    // Barcha savollarni olish
    const questionIds = answers.map(answer => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    let correctCount = 0;
    const details = [];

    // Har bir javobni tekshirish
    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      
      if (question) {
        const isCorrect = question.correctAnswerIndex === answer.selectedAnswer;
        if (isCorrect) correctCount++;
        
        details.push({
          questionId: answer.questionId,
          questionText: question.questionText,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswerIndex,
          isCorrect
        });
      }
    }

    const totalQuestions = answers.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    res.json({
      totalQuestions,
      correctAnswers: correctCount,
      score,
      details
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;