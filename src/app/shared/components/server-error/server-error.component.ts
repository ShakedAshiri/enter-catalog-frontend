import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent {
  @Input({ required: false }) text: string;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    // Use the dialog data if available
    if (data && data.text) {
      this.text = data.text;
    }
  }
}
