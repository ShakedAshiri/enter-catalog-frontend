import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorksComponent } from './user-works.component';

describe('UserWorksComponent', () => {
  let component: UserWorksComponent;
  let fixture: ComponentFixture<UserWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWorksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
