import { TestBed } from '@angular/core/testing';

import { PopupModalService } from './popup-modal.service';

describe('PopupModalService', () => {
  let service: PopupModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
