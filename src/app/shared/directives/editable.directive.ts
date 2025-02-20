import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Directive({
  selector: '[appEditable]',
})
export class EditableDirective implements AfterViewInit {
  private editIcon: ComponentRef<MatIcon>;
  private actionsContainer: HTMLElement;
  private isEditing = false;

  @Input() isEditable = true;
  @Output() startEdit = new EventEmitter<void>();
  @Output() saveEdit = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    // Setup host element
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

    // Create edit icon
    this.createEditIcon();

    // Add click listener to host element
    this.renderer.listen(this.el.nativeElement, 'click', () => {
      if (this.isEditable && !this.isEditing) {
        this.enterEditMode();
      }
    });

    // Add hover listeners
    this.renderer.listen(this.el.nativeElement, 'mouseenter', () => {
      if (this.isEditable && !this.isEditing) {
        this.showEditIcon();
      }
    });

    this.renderer.listen(this.el.nativeElement, 'mouseleave', () => {
      if (!this.isEditing) {
        this.hideEditIcon();
      }
    });
  }

  ngAfterViewInit() {
    const inputElements = this.el.nativeElement.querySelectorAll('input');
    const textareaElements = this.el.nativeElement.querySelectorAll('textarea');

    // Set pointer cursor if editable
    if (this.isEditable) {
      if (inputElements && inputElements[0]) {
        this.renderer.setStyle(inputElements[0], 'cursor', 'pointer');
      } else if (textareaElements && textareaElements[0]) {
        this.renderer.setStyle(textareaElements[0], 'cursor', 'pointer');
      }
    }
  }

  private createEditIcon() {
    this.editIcon = this.viewContainerRef.createComponent(MatIcon);

    // Set the icon name
    this.editIcon.instance.svgIcon = 'edit-pencil';

    const iconElement = this.editIcon.location.nativeElement;

    // Set styles
    this.renderer.setStyle(iconElement, 'position', 'absolute');
    this.renderer.setStyle(iconElement, 'top', '5px');
    this.renderer.setStyle(iconElement, 'right', '-5px');
    this.renderer.setStyle(iconElement, 'opacity', '0');
    this.renderer.setStyle(iconElement, 'overflow', 'visible');
    this.renderer.setStyle(
      iconElement,
      'transition',
      'opacity 0.2s ease-in-out'
    );

    this.renderer.insertBefore(
      this.el.nativeElement,
      iconElement,
      this.el.nativeElement.firstChild
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
    const saveButton = this.renderer.createElement('button');
    this.renderer.addClass(saveButton, 'mat-button');
    this.renderer.addClass(saveButton, 'btn-small');
    this.renderer.addClass(saveButton, 'btn-primary');
    this.renderer.setProperty(saveButton, 'innerHTML', 'אישור');
    this.renderer.listen(saveButton, 'click', (event: Event) => {
      event.stopPropagation();
      this.exitEditMode();
      this.saveEdit.emit();
    });

    // Create Cancel button
    const cancelButton = this.renderer.createElement('button');
    this.renderer.addClass(cancelButton, 'mat-button');
    this.renderer.addClass(cancelButton, 'btn-small');
    this.renderer.addClass(cancelButton, 'btn-primary');
    this.renderer.setProperty(cancelButton, 'innerHTML', 'ביטול');
    this.renderer.listen(cancelButton, 'click', (event: Event) => {
      event.stopPropagation();
      this.exitEditMode();
      this.cancelEdit.emit();
    });

    // Add buttons to container
    this.renderer.appendChild(this.actionsContainer, saveButton);
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
    this.isEditing = true;
    this.hideEditIcon();
    this.createActionButtons();
    this.startEdit.emit();
  }

  private exitEditMode() {
    this.isEditing = false;
    if (this.actionsContainer) {
      this.renderer.removeChild(this.el.nativeElement, this.actionsContainer);
      this.actionsContainer = null;
    }
  }
}
