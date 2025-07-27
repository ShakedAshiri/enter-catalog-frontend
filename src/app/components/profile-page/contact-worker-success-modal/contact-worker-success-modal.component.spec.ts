import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWorkerSuccessModalComponent } from './contact-worker-success-modal.component';

describe('ContactWorkerSuccessModalComponent', () => {
  let component: ContactWorkerSuccessModalComponent;
  let fixture: ComponentFixture<ContactWorkerSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactWorkerSuccessModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactWorkerSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
