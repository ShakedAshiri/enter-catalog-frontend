import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRectangleComponent } from './top-rectangle.component';

describe('TopRectangleComponent', () => {
  let component: TopRectangleComponent;
  let fixture: ComponentFixture<TopRectangleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRectangleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopRectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
