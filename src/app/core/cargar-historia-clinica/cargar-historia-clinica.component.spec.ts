import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarHistoriaClinicaComponent } from './cargar-historia-clinica.component';

describe('CargarHistoriaClinicaComponent', () => {
  let component: CargarHistoriaClinicaComponent;
  let fixture: ComponentFixture<CargarHistoriaClinicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargarHistoriaClinicaComponent]
    });
    fixture = TestBed.createComponent(CargarHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
