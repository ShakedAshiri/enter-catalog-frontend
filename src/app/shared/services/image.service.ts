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

  constructor() { }

  isFileTypeAllowed(file: File): boolean {
    return this.allowedFileTypes.includes(file.type);
  }
}
