import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import resultRouter from './routes/ResultRouter.js';
import quistionrouter from './routes/quistionRouter.js';
import adminRouter from './models/admin.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB (ES Modules Mode)'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('Medic API is Running with ES Modules...');
});

app.use('/api/user',userRoute)
app.use('/api/results', resultRouter);
app.use('/api/quistion', quistionrouter);
app.use('/api/admin', adminRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});