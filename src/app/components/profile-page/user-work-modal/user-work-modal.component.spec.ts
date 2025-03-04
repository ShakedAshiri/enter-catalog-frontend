import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkModalComponent } from './user-work-modal.component';

describe('UserWorkModalComponent', () => {
  let component: UserWorkModalComponent;
  let fixture: ComponentFixture<UserWorkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWorkModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWorkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
