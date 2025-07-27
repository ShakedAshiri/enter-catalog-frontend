import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactUsProfilePageComponent } from './contact-us-profile-page.component';

describe('ContactUsProfilePageComponent', () => {
  let component: ContactUsProfilePageComponent;
  let fixture: ComponentFixture<ContactUsProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsProfilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
