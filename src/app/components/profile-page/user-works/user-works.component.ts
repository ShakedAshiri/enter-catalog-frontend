import { Component, Input } from '@angular/core';
import { UserWork } from '../../../shared/models/userWork.class';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-user-works',
  imports: [MatGridListModule, MatCardModule, NgFor, NgIf],
  templateUrl: './user-works.component.html',
  styleUrl: './user-works.component.scss',
})
export class UserWorksComponent {
  @Input({ required: true }) userWorks!: UserWork[];

  constructor(protected readonly languageService: LanguageService) {}
}
