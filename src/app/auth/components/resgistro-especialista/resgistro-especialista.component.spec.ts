import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgistroEspecialistaComponent } from './resgistro-especialista.component';

describe('ResgistroEspecialistaComponent', () => {
  let component: ResgistroEspecialistaComponent;
  let fixture: ComponentFixture<ResgistroEspecialistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResgistroEspecialistaComponent]
    });
    fixture = TestBed.createComponent(ResgistroEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
