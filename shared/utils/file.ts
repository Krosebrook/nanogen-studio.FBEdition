
import { ValidationError } from './errors';

export const MAX_FILE_SIZE_MB = 5;
export const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic'];

/**
 * Validates file size and type.
 * @throws ValidationError
 */
export const validateFile = (file: File): void => {
  if (!file.type.startsWith('image/')) {
    throw new ValidationError('The selected file is not a valid image.');
  }

  const sizeInMB = file.size / (1024 * 1024);
  if (sizeInMB > MAX_FILE_SIZE_MB) {
    throw new ValidationError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
  }
};

/**
 * Reads a File object and returns a Promise that resolves with the Base64 Data URL.
 */
export const readImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      validateFile(file);
    } catch (err) {
      reject(err);
      return;
    }

    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new ValidationError('Failed to read file data.'));
      }
    };

    reader.onerror = () => {
      reject(new ValidationError('Error occurred while reading the file.'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Extracts the first image file from a DragEvent or ClipboardEvent.
 */
export const extractImageFile = (items: DataTransferItemList | undefined): File | null => {
  if (!items) return null;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      return items[i].getAsFile();
    }
  }
  return null;
};
