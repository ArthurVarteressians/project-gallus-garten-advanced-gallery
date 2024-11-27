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

// Route to get paginated and filtered images
router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const tag = req.query.tag as string | undefined;
  const imagesPerPage = 22; // Adjust the number of images per page as needed

  // Filter images by tag if a tag is provided
  let filteredImages = imagesData;
  if (tag) {
    filteredImages = imagesData.filter(image => image.tags.includes(tag));
  }

  // Calculate pagination
  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  const paginatedImages = filteredImages.slice(startIndex, endIndex);

  // Send paginated images, total count, and pagination info
  res.json({
    images: paginatedImages,
    currentPage: page,
    totalImages: filteredImages.length,
    hasMore: endIndex < filteredImages.length,
  });
});

export default router;
