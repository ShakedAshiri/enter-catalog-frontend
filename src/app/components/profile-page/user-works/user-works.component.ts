import { PopupModalService } from './../../../shared/services/popup-modal.service';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { UserWork } from '../../../shared/models/userWork.class';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { UserWorkModalComponent } from '../user-work-modal/user-work-modal.component';
import { UserWorksService } from '../../../shared/services/user-works.service';
import { environment } from '../../../../environments/environment';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { User } from '../../../shared/models/user.class';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-works',
  imports: [
    MatGridListModule,
    MatCardModule,
    NgFor,
    NgIf,
    MatIconModule,
    MatProgressSpinnerModule,
    NgTemplateOutlet,
    MatTooltipModule,
  ],
  templateUrl: './user-works.component.html',
  styleUrl: './user-works.component.scss',
})
export class UserWorksComponent {
  @Input({ required: true }) userWorks!: UserWork[];
  @Input({ required: true }) user: User;
  @Input() isEditable: boolean = false;

  isProduction = environment.production;
  loadingWorkIndex: number = null;

  constructor(
    protected readonly languageService: LanguageService,
    private popupModalService: PopupModalService,
    private worksService: UserWorksService,
  ) {}

  openWorkModal(userWork?: UserWork) {
    let dialogRef = this.popupModalService.open(
      UserWorkModalComponent,
      {
        disableClose: this.isEditable,
        width: '80%',
        maxWidth: '100%',
      },
      {
        isEditable: this.isEditable,
        userWork,
        title: userWork
          ? 'עדכון פרויקט מהגלריה שלי'
          : 'הוספת פרויקט לגלריה שלי',
      },
    );

    dialogRef.afterClosed().subscribe((updatedUserWork?: Partial<UserWork>) => {
      // If id exists == UPDATE userWork
      if (userWork && userWork.id && updatedUserWork) {
        this.loadingWorkIndex = userWork.id;

        this.worksService
          .updateUserWork(userWork.id, updatedUserWork)
          .subscribe({
            next: (response: UserWork) => {
              // Add updated values to the updated work
              this.userWorks = this.userWorks.map((work) =>
                work.id === userWork.id
                  ? {
                      ...work,
                      ...response,
                      images: [...work.images, ...response.images],
                    }
                  : work,
              );

              this.loadingWorkIndex = null;
            },
            error: (error) => {
              this.loadingWorkIndex = null;

              if (!this.isProduction)
                console.error('Error fetching data:', error);
              this.popupModalService.open(
                ServerErrorComponent,
                {},
                { text: 'אירעה שגיאה בעת עדכון העבודה.' },
              );
            },
          });
        // If id doesn't exist == CREATE userWork
      } else if (updatedUserWork) {
        updatedUserWork.user = this.user.id;
        this.loadingWorkIndex = -1;

        this.worksService.createUserWork(updatedUserWork).subscribe({
          next: (response: UserWork) => {
            this.loadingWorkIndex = null;
            this.userWorks.unshift(response);
          },
          error: (error) => {
            this.loadingWorkIndex = null;

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
