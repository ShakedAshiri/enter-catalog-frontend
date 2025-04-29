import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';
import { MatInputModule } from '@angular/material/input';
import { HiddenSubmitComponent } from '../../../../shared/components/hidden-submit/hidden-submit.component';
import { User } from '../../../../shared/models/user.class';
import { Branch } from '../../../../shared/models/data-tables/branch.class';
import { Category } from '../../../../shared/models/data-tables/category.class';
import { Subscription } from 'rxjs';
import { DataTableService } from '../../../../shared/services/data-table.service';

@Component({
  selector: 'app-user-details',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    HiddenSubmitComponent,
    MatProgressSpinnerModule,
    ModalWrapperComponent,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup;

  categories: Category[] = [];
  branches: Branch[] = [];

  displayNameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e ']+$"),
    Validators.minLength(2),
  ]);
  isAvailableControl: FormControl = new FormControl('');
  branchControl: FormControl = new FormControl('');
  categoriesControl: FormControl = new FormControl('');

  isProduction = environment.production;

  constructor(private dataTableService: DataTableService) {
    this.form = this.fb.group({
      displayName: this.displayNameControl,
      isAvailable: this.isAvailableControl,
      branch: this.branchControl,
      categories: this.categoriesControl,
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.dataTableService.getCategories().subscribe({
        next: (response: Category[]) => {
          this.categories = response;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          //this.showCategoriesServerError = true;
          //TODO: show error?
        },
      }),
    );

    this.subscriptions.push(
      this.dataTableService.getBranches().subscribe({
        next: (response: Branch[]) => {
          this.branches = response;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          //this.showBranchesServerError = true;
          //TODO: show error?
        },
      }),
    );
  }

  submit(): User {
    if (this.form.valid) {
      return this.form.value;
    }

    return null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
