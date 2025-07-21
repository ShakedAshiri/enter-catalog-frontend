import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsHomepageComponent } from './contact-us-homepage.component';

describe('ContactUsHomepageComponent', () => {
  let component: ContactUsHomepageComponent;
  let fixture: ComponentFixture<ContactUsHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsHomepageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
