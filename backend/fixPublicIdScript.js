const fs = require('fs');

// Load JSON file
const filePath = '../data/image_data.json'; // Replace with your actual JSON file path
let jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Update publicId for all entries
jsonData = jsonData.map((image, index) => {
  image.publicId = `GG_${index + 1}`;
  return image;
});

// Save the updated JSON file
fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

console.log('publicId fields updated successfully!');
