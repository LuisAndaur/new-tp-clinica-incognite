import { Component, OnInit } from '@angular/core';
import { Especialista } from 'src/app/shared/models/especialista.class';
import { Paciente } from 'src/app/shared/models/paciente.class';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit {

  currentUser!: Paciente | Especialista;

  constructor(
    private localStorage: LocalstorageService,
  ){}

  ngOnInit(): void {
    this.currentUser = this.localStorage.getItem('usuario');
  }

}
