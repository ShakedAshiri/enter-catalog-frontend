import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersGridComponent } from './users-grid.component';

describe('UsersGridComponent', () => {
  let component: UsersGridComponent;
  let fixture: ComponentFixture<UsersGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
