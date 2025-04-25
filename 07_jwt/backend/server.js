import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';
import userRoutes from './routes/user.routes.js';
import commentRoutes from './routes/comment.routes.js';
import ratingRoutes from './routes/rating.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

// Rutas
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);
app.use('/ratings', ratingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});