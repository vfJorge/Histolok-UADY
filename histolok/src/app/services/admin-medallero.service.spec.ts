import { TestBed } from '@angular/core/testing';

import { AdminMedalleroService } from './admin-medallero.service';

describe('AdminMedalleroService', () => {
  let service: AdminMedalleroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminMedalleroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
