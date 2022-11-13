import { TestBed } from '@angular/core/testing';

import { AdminExamenesService } from './admin-examenes.service';

describe('AdminExamenesService', () => {
  let service: AdminExamenesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminExamenesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
