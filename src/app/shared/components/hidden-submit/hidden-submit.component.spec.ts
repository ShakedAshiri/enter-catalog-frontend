import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenSubmitComponent } from './hidden-submit.component';

describe('HiddenSubmitComponent', () => {
  let component: HiddenSubmitComponent;
  let fixture: ComponentFixture<HiddenSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiddenSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
