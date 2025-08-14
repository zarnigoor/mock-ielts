const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - questionText
 *         - options
 *         - correctAnswerIndex
 *       properties:
 *         _id:
 *           type: string
 *           description: Savol ID si
 *         questionText:
 *           type: string
 *           description: Savol matni
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 4
 *           maxItems: 4
 *           description: 4 ta javob varianti
 *         correctAnswerIndex:
 *           type: integer
 *           minimum: 0
 *           maximum: 3
 *           description: To'g'ri javob indeksi (0-3)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /admin/questions:
 *   post:
 *     summary: Yangi savol qo'shish
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionText
 *               - options
 *               - correctAnswerIndex
 *             properties:
 *               questionText:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 4
 *                 maxItems: 4
 *               correctAnswerIndex:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 3
 *     responses:
 *       201:
 *         description: Savol muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Xato malumotlar
 */
router.post('/questions', async (req, res) => {
  try {
    const { questionText, options, correctAnswerIndex } = req.body;
    
    // Validatsiya
    if (!questionText || !options || correctAnswerIndex === undefined) {
      return res.status(400).json({ error: 'Barcha maydonlar to\'ldirilishi kerak' });
    }
    
    if (options.length !== 4) {
      return res.status(400).json({ error: '4 ta javob varianti bo\'lishi kerak' });
    }
    
    if (correctAnswerIndex < 0 || correctAnswerIndex > 3) {
      return res.status(400).json({ error: 'To\'g\'ri javob indeksi 0-3 orasida bo\'lishi kerak' });
    }

    const question = new Question({
      questionText,
      options,
      correctAnswerIndex
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admin/questions:
 *   get:
 *     summary: Barcha savollarni olish
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Savollar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 */
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admin/questions/{id}:
 *   get:
 *     summary: Bitta savolni olish
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Savol ID si
 *     responses:
 *       200:
 *         description: Savol ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Savol topilmadi
 */
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Savol topilmadi' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admin/questions/{id}:
 *   put:
 *     summary: Savolni yangilash
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Savol ID si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 4
 *                 maxItems: 4
 *               correctAnswerIndex:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 3
 *     responses:
 *       200:
 *         description: Savol yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Savol topilmadi
 */
router.put('/questions/:id', async (req, res) => {
  try {
    const { questionText, options, correctAnswerIndex } = req.body;
    
    // Validatsiya
    if (options && options.length !== 4) {
      return res.status(400).json({ error: '4 ta javob varianti bo\'lishi kerak' });
    }
    
    if (correctAnswerIndex !== undefined && (correctAnswerIndex < 0 || correctAnswerIndex > 3)) {
      return res.status(400).json({ error: 'To\'g\'ri javob indeksi 0-3 orasida bo\'lishi kerak' });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, options, correctAnswerIndex },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ error: 'Savol topilmadi' });
    }

    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /admin/questions/{id}:
 *   delete:
 *     summary: Savolni o'chirish
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Savol ID si
 *     responses:
 *       200:
 *         description: Savol o'chirildi
 *       404:
 *         description: Savol topilmadi
 */
router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Savol topilmadi' });
    }
    res.json({ message: 'Savol muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;