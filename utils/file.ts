export const MAX_FILE_SIZE_MB = 5;
export const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic'];

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

/**
 * Validates file size and type.
 * @throws FileValidationError
 */
export const validateFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    throw new FileValidationError('The selected file is not a valid image.');
  }

  // Check generic MIME type support if needed, though 'image/*' covers most.
  // We can be stricter if API requires it.
  
  const sizeInMB = file.size / (1024 * 1024);
  if (sizeInMB > MAX_FILE_SIZE_MB) {
    throw new FileValidationError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
  }
};

/**
 * Reads a File object and returns a Promise that resolves with the Base64 Data URL.
 * Handles errors during file reading and performs validation.
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
        reject(new Error('Failed to read file data.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error occurred while reading the file.'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Extracts the first image file from a DragEvent or ClipboardEvent.
 * Returns the File object or null if no image is found.
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
