import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroemprendimientoLibComponent } from './centroemprendimiento-lib.component';

describe('CentroemprendimientoLibComponent', () => {
  let component: CentroemprendimientoLibComponent;
  let fixture: ComponentFixture<CentroemprendimientoLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentroemprendimientoLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentroemprendimientoLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
