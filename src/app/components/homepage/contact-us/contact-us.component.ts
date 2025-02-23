import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApplyReason } from '../../../shared/models/data-tables/applyReason.class';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, NgFor],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  @Input({ required: true }) applyReasons!: ApplyReason[];
}
