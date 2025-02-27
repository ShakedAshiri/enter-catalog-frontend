import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactUsForm } from '../models/contactUsForm.class';
import { ApiConstants } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(private http: HttpClient) {}

  public submitContactUsForm(body: ContactUsForm) {
    return this.http.post<ContactUsForm>(
      ApiConstants.ENDPOINTS.EMAIL.CONTACT_US,
      body
    );
  }
}
