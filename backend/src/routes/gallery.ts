import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Load images data from JSON file
const imagesFilePath = path.resolve(__dirname, '../../../data/image_data.json');
let imagesData: any[] = [];

// Load data from JSON file once at server startup
fs.readFile(imagesFilePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading images data:', err);
  } else {
    imagesData = JSON.parse(data);
  }
});

// Route to get paginated images
router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const imagesPerPage = 22; // Can change image count here

  // Calculate the start and end indices for pagination
  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  const paginatedImages = imagesData.slice(startIndex, endIndex);

  // Send paginated images and total count to the client
  res.json({
    images: paginatedImages,
    currentPage: page,
    totalImages: imagesData.length,
    hasMore: endIndex < imagesData.length
  });
});

export default router;
