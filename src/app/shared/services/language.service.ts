import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor() {}

  isHebrew = (text: string): boolean => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text);
  };

  isEnglish = (text: string): boolean => {
    const englishRegex = /^[A-Za-z0-9\s.,!?'"()]+$/;
    return englishRegex.test(text);
  };
}
