import { TestBed } from '@angular/core/testing';

import { OpenTripMapService } from './opentripmap.service';

describe('OpentripmapService', () => {
  let service: OpenTripMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenTripMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
