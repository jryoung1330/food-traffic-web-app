import { TestBed } from '@angular/core/testing';

import { VendorService } from './vendor.service';

describe('HttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VendorService = TestBed.get(VendorService);
    expect(service).toBeTruthy();
  });
});
