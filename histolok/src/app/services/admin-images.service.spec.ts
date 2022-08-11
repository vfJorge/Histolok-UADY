import { TestBed } from '@angular/core/testing';

import { AdminImagesService } from './admin-images.service';

describe('AdminImagesService', () => {
  let service: AdminImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
