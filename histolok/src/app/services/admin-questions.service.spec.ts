import { TestBed } from '@angular/core/testing';

import { AdminQuestionsService } from './admin-questions.service';

describe('AdminQuestionsService', () => {
  let service: AdminQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
