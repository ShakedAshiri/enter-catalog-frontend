import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Directive({
  selector: '[appEditable]',
})
export class EditableDirective implements AfterViewInit, OnChanges {
  private unlistenToSaveButton: () => void;
  private unlistenToCancelButton: () => void;

  private editIcon: ComponentRef<MatIcon>;
  private actionsContainer: HTMLElement;
  private saveButton: HTMLButtonElement;
  private isEditing = false;

  @Input() isEditable = true;
  @Input() iconTop: number = 5;
  @Input() iconRight: number = -5;
  @Input() isMultiEdit: boolean = false;
  @Input() isSaveDisabled: boolean = false;
  @Output() startEdit = new EventEmitter<void>();
  @Output() saveEdit = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
  ) {
    // Setup host element
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

    // Add click listener to host element
    this.renderer.listen(this.el.nativeElement, 'click', () => {
      if (this.isEditable && (this.isMultiEdit || !this.isEditing)) {
        this.enterEditMode();
      }
    });

    // Add hover listeners
    this.renderer.listen(this.el.nativeElement, 'mouseenter', () => {
      // Show edit icon if editable and
      // either not yet editing
      // or already editing & in multi edit mode
      if (
        this.isEditable &&
        ((this.isMultiEdit && this.isEditing) || !this.isEditing)
      ) {
        this.showEditIcon();
      }
    });

    this.renderer.listen(this.el.nativeElement, 'mouseleave', () => {
      this.hideEditIcon();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Create edit icon - only after receiving input
    this.createEditIcon();

    if (changes['isSaveDisabled'] && this.actionsContainer) {
      this.updateSaveButtonState();
    }
  }

  ngAfterViewInit() {
    const inputElements = this.el.nativeElement.querySelectorAll('input');
    const textareaElements = this.el.nativeElement.querySelectorAll('textarea');

    if (this.isEditable) {
      // Set pointer cursor if editable
      if (inputElements && inputElements[0]) {
        this.renderer.setStyle(inputElements[0], 'cursor', 'pointer');
      } else if (textareaElements && textareaElements[0]) {
        this.renderer.setStyle(textareaElements[0], 'cursor', 'pointer');
      }
    }
  }

  private createEditIcon() {
    if (this.editIcon) return;

    this.editIcon = this.viewContainerRef.createComponent(MatIcon);

    // Set the icon name
    this.editIcon.instance.svgIcon = 'edit-pencil';

    const iconElement = this.editIcon.location.nativeElement;

    // Set styles
    this.renderer.setStyle(iconElement, 'position', 'absolute');
    this.renderer.setStyle(iconElement, 'top', this.iconTop + 'px');
    this.renderer.setStyle(iconElement, 'right', this.iconRight + 'px');
    this.renderer.setStyle(iconElement, 'opacity', '0');
    this.renderer.setStyle(iconElement, 'overflow', 'visible');
    this.renderer.setStyle(
      iconElement,
      'transition',
      'opacity 0.2s ease-in-out',
    );

    this.renderer.insertBefore(
      this.el.nativeElement,
      iconElement,
      this.el.nativeElement.firstChild,
    );
  }

  private createActionButtons() {
    this.actionsContainer = this.renderer.createElement('div');

    // Style the actions container
    const containerStyles = {
      display: 'flex',
      gap: '8px',
      'margin-top': '2px',
      'padding-right': '16px',
    };

    Object.entries(containerStyles).forEach(([property, value]) => {
      this.renderer.setStyle(this.actionsContainer, property, value);
    });

    // Create Save button
    this.saveButton = this.renderer.createElement('button');
    this.renderer.addClass(this.saveButton, 'mat-button');
    this.renderer.addClass(this.saveButton, 'btn');
    this.renderer.addClass(this.saveButton, 'btn-small');
    this.renderer.addClass(this.saveButton, 'btn-primary');
    this.renderer.setProperty(this.saveButton, 'innerHTML', 'אישור');

    this.updateSaveButtonState();

    this.unlistenToSaveButton = this.renderer.listen(
      this.saveButton,
      'click',
      (event: Event) => {
        this.saveButton.focus(); // Remove focus from host element
        event.stopPropagation();
        this.exitEditMode();
        this.saveEdit.emit();
      },
    );

    // Create Cancel button
    const cancelButton = this.renderer.createElement('button');
    this.renderer.addClass(cancelButton, 'mat-button');
    this.renderer.addClass(cancelButton, 'btn');
    this.renderer.addClass(cancelButton, 'btn-small');
    this.renderer.addClass(cancelButton, 'btn-primary');
    this.renderer.setProperty(cancelButton, 'innerHTML', 'ביטול');
    this.unlistenToCancelButton = this.renderer.listen(
      cancelButton,
      'click',
      (event: Event) => {
        event.stopPropagation();
        this.exitEditMode();
        this.cancelEdit.emit();
      },
    );

    // Add buttons to container
    this.renderer.appendChild(this.actionsContainer, this.saveButton);
    this.renderer.appendChild(this.actionsContainer, cancelButton);

    // Add container to host element
    this.renderer.appendChild(this.el.nativeElement, this.actionsContainer);
  }

  private showEditIcon() {
    this.editIcon.location.nativeElement.style.opacity = 1;
  }

  private hideEditIcon() {
    this.editIcon.location.nativeElement.style.opacity = 0;
  }

  private enterEditMode() {
    // Start editing if not already
    if (!this.isEditing) {
      this.isEditing = true;
      this.createActionButtons();
    }

    // Hide edit button only if not multi edit
    if (!this.isMultiEdit) {
      this.hideEditIcon();
    }

    this.startEdit.emit();
  }

  private exitEditMode() {
    this.isEditing = false;

    if (this.isMultiEdit) this.hideEditIcon();

    if (this.actionsContainer) {
      this.renderer.removeChild(this.el.nativeElement, this.actionsContainer);
      this.actionsContainer = null;
      this.saveButton = null;
    }
  }

  ngOnDestroy() {
    if (this.unlistenToSaveButton) {
      this.unlistenToSaveButton();
    }

    if (this.unlistenToCancelButton) {
      this.unlistenToCancelButton();
    }

    if (this.editIcon) {
      this.editIcon.destroy();
      this.editIcon = null;
    }
  }

  private updateSaveButtonState() {
    this.renderer.setProperty(this.saveButton, 'disabled', this.isSaveDisabled);
  }
}
