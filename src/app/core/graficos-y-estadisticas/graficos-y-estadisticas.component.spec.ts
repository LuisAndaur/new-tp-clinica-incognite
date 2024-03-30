import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficosYEstadisticasComponent } from './graficos-y-estadisticas.component';

describe('GraficosYEstadisticasComponent', () => {
  let component: GraficosYEstadisticasComponent;
  let fixture: ComponentFixture<GraficosYEstadisticasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficosYEstadisticasComponent]
    });
    fixture = TestBed.createComponent(GraficosYEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
