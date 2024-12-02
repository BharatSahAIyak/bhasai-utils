import express from 'express';
import webhookRouter from './webhook';

const app = express();
app.use(express.json()); // For parsing JSON payloads
app.use(webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
