import express, { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';

// Initialize the router
const router: Router = express.Router();
const imagesFilePath: string = path.resolve(__dirname, '../../../data/image_data.json');

// Helper function to load JSON data
const loadImageData = (): { publicId: string; likes: number }[] => {
  try {
    const data = fs.readFileSync(imagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return [];
  }
};

// Route to get likes for a specific image by publicId
router.get('/likes/:id', (req: Request<{ id: string }>, res: Response): void => {
  const { id } = req.params;

  // Load data from JSON file
  const imagesData = loadImageData();
  const image = imagesData.find(img => img.publicId === id);

  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  // Return likes count
  res.json({ likes: image.likes });
});

export default router;
