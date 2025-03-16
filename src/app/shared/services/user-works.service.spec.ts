import { TestBed } from '@angular/core/testing';

import { UserWorksService } from './user-works.service';

describe('UserWorksService', () => {
  let service: UserWorksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWorksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
