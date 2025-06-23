import fs from "node:fs/promises";
import path from "node:path";

export async function getArtistImages(
  artistId: string,
): Promise<{ image: string; flip_image: string; all_images: string[] }> {
  const assetsDir = path.join(process.cwd(), "public/assets/artists", artistId);

  try {
    const files = await fs.readdir(assetsDir);
    const jpgFiles = files
      .filter(
        (file) =>
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".jpeg") ||
          file.toLowerCase().endsWith(".png"),
      )
      .sort();

    const all_images = jpgFiles.map(
      (file) => `/assets/artists/${artistId}/${file}`,
    );
    const image = jpgFiles[0]
      ? `/assets/artists/${artistId}/${jpgFiles[0]}`
      : "";
    const flip_image = jpgFiles[1]
      ? `/assets/artists/${artistId}/${jpgFiles[1]}`
      : image;

    return { image, flip_image, all_images };
  } catch {
    // If folder doesn't exist or no images found, return empty strings
    return { image: "", flip_image: "", all_images: [] };
  }
}
