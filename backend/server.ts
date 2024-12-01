import express from 'express';
import cors from 'cors';
import galleryRouter from './src/routes/gallery';
import galleryFilter from './src/routes/galleryFilter';
import likes from './src/routes/Likes'
const app = express();
app.use(cors());

// Use the paginated gallery route
app.use('/api/images', galleryRouter);
app.use('/api/images/filter', galleryFilter)
app.use('/api/' , likes)

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});