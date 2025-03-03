import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hidden-submit',
  imports: [],
  templateUrl: './hidden-submit.component.html',
  styleUrl: './hidden-submit.component.scss',
})
export class HiddenSubmitComponent {
  @Input({ required: true }) disabled: boolean;
  @Output() submission = new EventEmitter<void>();

  emitSubmission() {
    this.submission.emit();
  }
}
