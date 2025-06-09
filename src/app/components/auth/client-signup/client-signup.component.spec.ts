import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSignupComponent } from './client-signup.component';

describe('ClientSignupComponent', () => {
  let component: ClientSignupComponent;
  let fixture: ComponentFixture<ClientSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
