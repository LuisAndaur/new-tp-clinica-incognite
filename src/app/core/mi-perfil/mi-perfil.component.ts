import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Especialidad } from 'src/app/shared/models/especialidad.class';
import { Especialista } from 'src/app/shared/models/especialista.class';
import { Paciente } from 'src/app/shared/models/paciente.class';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { PdfService } from 'src/app/shared/services/pdf.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0}), 
        animate('1s ease-in', 
        style({opacity:1}))
      ])
    ]),
  ]
})
export class MiPerfilComponent implements OnInit {

  usuarioActual!: any;
  usuario!: Usuario | Paciente | Especialista;
  obraSocial!:string;
  img2!:any;
  especialidades!:Array<Especialidad>;
  listaEspecialidades: Array<Especialidad> = [];
  mostrarHorarios:boolean = false;
  especialidadElegida:string = '';
  turnos: Array<any> | null = [];
  mostrarhc: boolean = false;
  emailPacientePadre: string = "";
  idTurnoPadre: string = "";

  constructor(private db: FirestoreService,
              private spinner: SpinnerService,
              private localStorage: LocalstorageService,
              private swal: SwalService,
              private pdf: PdfService ){}

  ngOnInit(): void {
    debugger;
    this.spinner.mostrar();

    this.db.obtenerEspecialidades().subscribe((e) => {
      console.log("Especialidades: ", e);
      this.listaEspecialidades = e;
      this.spinner.ocultar();
    });

    this.usuarioActual = this.localStorage.getItem('usuario');

    if(this.usuarioActual != null){

      if(this.usuarioActual.tipo == 'paciente'){
        this.db.obtenerPaciente(this.usuarioActual.email)
        .then((p) => {
          this.usuario = p as Paciente;
          this.img2 = p.img2;
          this.obraSocial = p.obraSocial
        }).finally(() => this.spinner.ocultar());
      }

      if(this.usuarioActual.tipo == 'especialista'){
        this.db.obtenerEspecialista(this.usuarioActual.email)
        .then((u) => {
          this.usuario = u as Especialista;
          this.especialidades = u.especialidades;
        }).finally(() => this.spinner.ocultar());
        
      }

      if(this.usuarioActual.tipo == 'administrador'){
        this.db.obtenerUsuario(this.usuarioActual.email)
        .then((u) => {
          this.usuario = u as Usuario;
        }).finally(() => this.spinner.ocultar());
        
      }

      console.log('User mi perfil: ', this.usuario);

      
    }
  }

  mostrarHistoriaClinica(email: string | undefined) {
    
    this.db.obtenerTurnosPaciente(email as string).subscribe((t) => {
      this.turnos = t.filter((x) => x['historiaClinica'] != undefined);

      debugger;
      if(this.turnos.length > 0){

        this.idTurnoPadre = '';
        this.emailPacientePadre = email as string;
        this.mostrarhc = true;
      }
      else{
        this.swal.warning("No tiene turnos finalizados!")
      }
    });
  }

  verHistoria(ver: boolean){
    this.mostrarhc = ver;
  }

  seleccion(user: string){
    this.especialidadElegida = user;
  }

  descargarPdf(paciente: Usuario, email: string) {

    debugger;

    if(this.especialidadElegida == ''){
      this.swal.warning('Elija una especialidad!');
      return;
    }
    
    this.db.obtenerTurnosPaciente(email as string).subscribe((t) => {
      this.turnos = t.filter((x) => (x['historiaClinica'] != undefined) && x['especialidad']['id'] == this.especialidadElegida);

      if(this.turnos.length < 1){
        this.swal.warning('No tiene historias con esa especialidad!');
        return;
      }

      if(this.turnos.length>0){
        if(this.turnos != null){
          this.pdf.descargarPDFHistoriaClinica(paciente, this.turnos);
        }
        else{
          this.swal.warning('No tiene turnos finalizados o historias clínicas.')
        }
      }
      else{
        this.swal.warning("No tiene turnos!");
      }
    });
  }


}
