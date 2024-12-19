import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

const imagesFilePath = path.resolve(__dirname, "../../../data/image_data.json");

let imagesData: any[] = [];

fs.readFile(imagesFilePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading images data:", err);
  } else {
    imagesData = JSON.parse(data);
  }
});

const saveImages = () => {
  fs.writeFileSync(
    imagesFilePath,
    JSON.stringify(imagesData, null, 2),
    "utf-8"
  );
};

router.get("/", (req: Request, res: Response) => {
  const { search = "" } = req.query;

  if (search) {
    const image = imagesData.find((img) => img.publicId === search);
    if (image) {
      return res.json({ images: [image] });
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  }

  res.json({ images: imagesData });
});

router.put(
  "/update-description/:publicId",
  (req: Request<{ publicId: string }>, res: Response) => {
    const { publicId } = req.params;
    const { description } = req.body;

    if (!description || typeof description !== "string") {
      console.log("Invalid description:", description);
      return res.status(400).json({ message: "Invalid description provided" });
    }

    try {
      const imageIndex = imagesData.findIndex(
        (img) => img.publicId === publicId
      );

      if (imageIndex === -1) {
        return res.status(404).json({ message: "Image not found" });
      }

      imagesData[imageIndex].description = description;
      saveImages();

      res.json({
        message: "Description updated successfully",
        image: imagesData[imageIndex],
      });
    } catch (error) {
      console.error("Error updating description:", error);
      res
        .status(500)
        .json({ message: "Error updating image description", error });
    }
  }
);

export default router;
