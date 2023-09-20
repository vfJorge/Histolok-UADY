import { TestBed } from '@angular/core/testing';

import { AdminGruposService } from './admin-grupos.service';

describe('AdminGruposService', () => {
  let service: AdminGruposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGruposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
