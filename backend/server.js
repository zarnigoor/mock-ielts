const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB ulanishi
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB ga ulanish muvaffaqiyatli'))
.catch(err => console.error('MongoDB ulanish xatosi:', err));

// Swagger konfiguratsiyasi
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IELTS Mock Exam API',
      version: '1.0.0',
      description: 'API for IELTS Mock Examination Platform',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'], // yo'llar fayllari
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes import qilinadi
const questionRoutes = require('./routes/questions');
const adminRoutes = require('./routes/admin');

// Routes ishlatish
app.use('/questions', questionRoutes);
app.use('/admin', adminRoutes);
app.use('/submit', questionRoutes);

// Asosiy endpoint
app.get('/', (req, res) => {
  res.json({ message: 'IELTS Mock Exam API ishlamoqda!' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlamoqda`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});