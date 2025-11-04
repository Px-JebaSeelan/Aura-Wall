
/**
 * Re-encodes a base64 encoded JPEG image to a specified quality.
 * @param base64 The original base64 string (without 'data:image/jpeg;base64,' prefix).
 * @param quality A number between 0 and 1 representing the desired JPEG quality.
 * @returns A promise that resolves with the new base64 string (without prefix).
 */
export const reEncodeImage = (base64: string, quality: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      // Strip the data URL prefix to get just the base64 string
      resolve(dataUrl.substring(dataUrl.indexOf(',') + 1));
    };
    img.onerror = (err) => {
      const error = new Error(`Failed to load image for re-encoding.`);
      console.error(err); // Log the original error event
      reject(error);
    };
    img.src = `data:image/jpeg;base64,${base64}`;
  });
};
