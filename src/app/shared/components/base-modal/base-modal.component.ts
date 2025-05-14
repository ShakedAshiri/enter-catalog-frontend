import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  template: '',
})
export abstract class BaseModalComponent<T = any> {
  protected dialogRef = inject(MatDialogRef<T>);

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  abstract submit(): void;
}
