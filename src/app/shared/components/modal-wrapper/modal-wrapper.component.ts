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
  styleUrl: './modal-wrapper.component.scss',
})
export class ModalWrapperComponent extends BaseModalComponent {
  @Input() title: string = '';
  @Input() closeOption: boolean = true;
  @Input() disableSubmit: boolean = false;
  @ContentChild('actions') actionsTemplate!: TemplateRef<any>;

  @Input() childSubmit!: () => void;

  override submit(): void {
    // Default submit or rely on child's override
    const result = this.childSubmit?.();

    this.close(result !== undefined ? result : true);
  }
}
