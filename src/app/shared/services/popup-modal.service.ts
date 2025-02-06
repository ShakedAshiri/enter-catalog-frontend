import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class PopupModalService {

  constructor(private dialog: MatDialog) {}

  // Generic method to open any component as a modal
  open<T, D = any, R = any>(component: ComponentType<T>,
                            config: MatDialogConfig<D> = {}): MatDialogRef<T, R> {

    // Set default configuration
    const defaultConfig: MatDialogConfig = {
      width: '500px',
      autoFocus: false,
      ...config
    };

    return this.dialog.open<T, D, R>(component, defaultConfig);
  }
}
