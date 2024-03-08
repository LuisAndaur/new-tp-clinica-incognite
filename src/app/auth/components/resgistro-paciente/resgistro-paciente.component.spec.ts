import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgistroPacienteComponent } from './resgistro-paciente.component';

describe('ResgistroPacienteComponent', () => {
  let component: ResgistroPacienteComponent;
  let fixture: ComponentFixture<ResgistroPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResgistroPacienteComponent]
    });
    fixture = TestBed.createComponent(ResgistroPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
