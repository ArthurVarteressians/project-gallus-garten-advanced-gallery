import express from 'express';
import cors from 'cors';
import galleryRouter from './src/routes/gallery';
import galleryFilter from './src/routes/galleryFilter';
import adminDash from './src/routes/adminDash';
import adminLogin from './src/routes/adminLogin';
//import likes from './src/routes/Likes';
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/images', galleryRouter);
app.use('/api/images/filter', galleryFilter)
//app.use('/api/likes/:id' , likes)
app.use('/api/adminPanelDash', adminDash);
app.use('/api/login', adminLogin);


const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});