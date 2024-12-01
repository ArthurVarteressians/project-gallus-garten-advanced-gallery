import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Path to the JSON file
const imagesFilePath = path.resolve(__dirname, '../../../data/image_data.json');
let imagesData: any[] = [];

// Load the data from the JSON file at server startup
try {
    const data = fs.readFileSync(imagesFilePath, 'utf-8');
    imagesData = JSON.parse(data);
    console.log('Images data loaded successfully.');
} catch (err) {
    console.error('Error loading images data:', err);
}

// Endpoint to get unique tags
router.get('/', (req, res) => {
    try {
        // Flatten all "tags" arrays and remove duplicates
        const allTags = imagesData.flatMap(image => image.tags);
        const uniqueTags = [...new Set(allTags)];

        res.json({ tags: uniqueTags }); // Respond with the unique tags
    } catch (error) {
        console.error('Error processing tags:', error);
        res.status(500).json({ error: 'Failed to process tags' });
    }
});

export default router;
