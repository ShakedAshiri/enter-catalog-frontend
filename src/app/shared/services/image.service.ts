import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  get defaultAvatar(): string {
    return 'avatar.png';
  }

  constructor() { }

  isFileTypeAllowed(file: File): boolean {
    return this.allowedFileTypes.includes(file.type);
  }

  checkAspectRatio(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        // Allow a small tolerance for aspect ratio (e.g., 0.95 to 1.05)
        const isValid = Math.abs(aspectRatio - 1) < 0.05;
        resolve(isValid);
      };
      img.src = URL.createObjectURL(file);
    });
  }
}
