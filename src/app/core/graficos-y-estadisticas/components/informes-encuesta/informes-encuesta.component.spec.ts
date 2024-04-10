import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesEncuestaComponent } from './informes-encuesta.component';

describe('InformesEncuestaComponent', () => {
  let component: InformesEncuestaComponent;
  let fixture: ComponentFixture<InformesEncuestaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformesEncuestaComponent]
    });
    fixture = TestBed.createComponent(InformesEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
