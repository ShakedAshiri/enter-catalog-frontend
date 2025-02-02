import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { BaseModalComponent } from '../base-modal/base-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-modal-wrapper',
  imports: [MatDialogModule, MatIconModule, CommonModule, A11yModule],
  templateUrl: './modal-wrapper.component.html',
  styleUrl: './modal-wrapper.component.scss'
})
export class ModalWrapperComponent extends BaseModalComponent {
  @Input() title: string = '';
  @ContentChild('actions') actionsTemplate!: TemplateRef<any>;

  submit(): void {
    // Can be overridden by child components
    this.close(true);
  }
}
