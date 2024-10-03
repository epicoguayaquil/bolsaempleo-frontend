import { TestBed } from '@angular/core/testing';

import { CentroemprendimientoLibService } from './centroemprendimiento-lib.service';

describe('CentroemprendimientoLibService', () => {
  let service: CentroemprendimientoLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentroemprendimientoLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
