import { PopupModalService } from './../../../shared/services/popup-modal.service';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { UserWork } from '../../../shared/models/userWork.class';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { UserWorkModalComponent } from '../user-work-modal/user-work-modal.component';

@Component({
  selector: 'app-user-works',
  imports: [MatGridListModule, MatCardModule, NgFor, NgIf, MatIconModule],
  templateUrl: './user-works.component.html',
  styleUrl: './user-works.component.scss',
})
export class UserWorksComponent {
  @Input({ required: true }) userWorks!: UserWork[];
  @Input() isEditable: boolean = false;

  constructor(
    protected readonly languageService: LanguageService,
    private popupModalService: PopupModalService,
  ) {}

  openWorkModal(userWork?: UserWork) {
    let dialogRef = this.popupModalService.open(UserWorkModalComponent, {
      disableClose: true,
    });

    // TODO: save result
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });
  }
}
