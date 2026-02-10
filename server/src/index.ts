import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import { MONGODB_URI, PORT } from './config';

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
