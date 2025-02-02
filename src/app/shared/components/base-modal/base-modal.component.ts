import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  template: ''
})
export abstract class BaseModalComponent {
  protected dialogRef = inject(MatDialogRef);

  close(result?: any): void {
    this.dialogRef.close(result);
  }
}
