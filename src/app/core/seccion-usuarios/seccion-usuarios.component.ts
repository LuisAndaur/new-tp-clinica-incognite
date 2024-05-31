import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { Turno } from 'src/app/shared/models/turno.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { Paciente } from 'src/app/shared/models/paciente.class';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss'],
  animations: [
    trigger('fadeInTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('1000ms ease-in', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('2500ms ease-out', style({ opacity: 0, transform: 'translateY(100%)' })),
      ]),
    ])
  ]
})
export class SeccionUsuariosComponent implements OnInit{
  usuariosColumnas: string[] = ['fechaRegistro', 'nombre', 'apellido', 'edad', 'dni', 'obraSocial', 'especialidad', 'rol', 'estado', 'accion'];
  dataUsuarios: Array<any> = [];
  user!: string;
  vistaTabla: boolean = false;
  turnos: Array<any> | null = [];
  mostrarhc: boolean = false;
  emailPacientePadre: string = "";
  idTurnoPadre: string = "";

  constructor(private db: FirestoreService,
    private excel: ExcelService,
    private spinner: SpinnerService,
    private swal: SwalService){}

  ngOnInit(): void {

    this.spinner.mostrar();

    this.db.obtenerUsuarios().subscribe((users) => {
      this.dataUsuarios = users;
      console.log('Uusuarios: ', this.dataUsuarios);
      this.spinner.ocultar();
    });

  }

  seleccion(user: string){
    this.user = user;
  }

  aceptar(usuario:any, estado: string){
    this.spinner.mostrar();
    usuario.estado = estado;
    this.db.actualizarUsuario(usuario)
      .then(()=>{
        this.swal.success("Se actualizó el estado!");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      });
  }

  rechazar(usuario:any, estado: string){
    this.spinner.mostrar();
    usuario.estado = estado;
    this.db.actualizarUsuario(usuario)
      .then(()=>{
        this.swal.success("Se actualizó el estado!");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      });
  }

  actualizarEstado(usuario:any, estado: string): boolean{
    return usuario.estado == estado;
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

  descargarUsuarios() {
    this.excel.guardarExcelListaUsuarios(this.dataUsuarios);
  }

  descargarDatosUsuario(paciente: Paciente, email: string) {
    
    this.db.obtenerTurnosPaciente(email as string).subscribe((t) => {
      this.turnos = t.filter((x) => x['estadoTurno'] == 'Finalizado');

      debugger;
      if(this.turnos.length>0){
        if(this.turnos != null){
          this.excel.descargarExcelDatosPaciente(paciente, this.turnos);
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

  verHistoria(ver: boolean){
    this.mostrarhc = ver;
  }

}
