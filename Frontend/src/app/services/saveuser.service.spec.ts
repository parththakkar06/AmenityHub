import { TestBed } from '@angular/core/testing';

import { SaveuserService } from './saveuser.service';

describe('SaveuserService', () => {
  let service: SaveuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
