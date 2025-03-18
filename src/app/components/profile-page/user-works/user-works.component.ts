import { PopupModalService } from './../../../shared/services/popup-modal.service';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { UserWork } from '../../../shared/models/userWork.class';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { UserWorkModalComponent } from '../user-work-modal/user-work-modal.component';
import { UserWorksService } from '../../../shared/services/user-works.service';
import { environment } from '../../../../environments/environment';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { User } from '../../../shared/models/user.class';

@Component({
  selector: 'app-user-works',
  imports: [MatGridListModule, MatCardModule, NgFor, NgIf, MatIconModule],
  templateUrl: './user-works.component.html',
  styleUrl: './user-works.component.scss',
})
export class UserWorksComponent {
  @Input({ required: true }) userWorks!: UserWork[];
  @Input({ required: true }) user: User;
  @Input() isEditable: boolean = false;

  isProduction = environment.production;

  constructor(
    protected readonly languageService: LanguageService,
    private popupModalService: PopupModalService,
    private worksService: UserWorksService,
  ) {}

  openWorkModal(userWork?: UserWork) {
    let dialogRef = this.popupModalService.open(
      UserWorkModalComponent,
      {
        disableClose: true,
      },
      {
        isEditable: this.isEditable,
        userWork,
        title: userWork
          ? 'עדכון פרויקט מהגלריה שלי'
          : 'הוספת פרויקט לגלריה שלי',
      },
    );

    dialogRef.afterClosed().subscribe((userWork?: UserWork) => {
      // If id exists == update userWork
      if (userWork && userWork.id) {
        this.worksService.updateUserWork(this.user.id, userWork).subscribe({
          next: (response: UserWork) => {
            this.userWorks.push(response);
          },
          error: (error) => {
            if (!this.isProduction)
              console.error('Error fetching data:', error);
            this.popupModalService.open(
              ServerErrorComponent,
              {},
              { text: 'אירעה שגיאה בעת עדכון העבודה.' },
            );
          },
        });
        // If id doesn't exist == create userWork
      } else if (userWork) {
        userWork.user = this.user.id;

        this.worksService.createUserWork(userWork).subscribe({
          next: (response: UserWork) => {
            this.userWorks.push(response);
          },
          error: (error) => {
            if (!this.isProduction)
              console.error('Error fetching data:', error);
            this.popupModalService.open(
              ServerErrorComponent,
              {},
              { text: 'אירעה שגיאה בעת שמירת העבודה.' },
            );
          },
        });
      }
    });
  }
}
