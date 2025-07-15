import { TestBed } from '@angular/core/testing';

import { TraineeDetailsService } from './trainee-details.service';

describe('TraineeDetailsService', () => {
  let service: TraineeDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraineeDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
