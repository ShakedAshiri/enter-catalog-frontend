import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWorkerModalComponent } from './contact-worker-modal.component';

describe('ContactWorkerModalComponent', () => {
  let component: ContactWorkerModalComponent;
  let fixture: ComponentFixture<ContactWorkerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactWorkerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactWorkerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
