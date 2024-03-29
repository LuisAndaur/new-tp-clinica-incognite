import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HistoriaClinica } from '../../models/historia-clinica.class';
import { Turno } from '../../models/turno.class';
import { Usuario } from '../../models/usuario.class';
import { FirestoreService } from '../../services/firestore.service';
import { SpinnerService } from '../../services/spinner.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-ver-historia-clinica',
  templateUrl: './ver-historia-clinica.component.html',
  styleUrls: ['./ver-historia-clinica.component.scss']
})
export class VerHistoriaClinicaComponent {

  @Input() emailPaciente!: string;
  @Input() idTurno!: string;
  @Output() viewHc = new EventEmitter<boolean>();
  currentUser!: Usuario;
  filtro: string = "";
  turnos: Array<any> | null = [];
  historiasClinicas: any;
  hcColumnas: string[] = ['altura', 'peso', 'temperatura', 'presion', 'clave_1', 'clave_2', 'clave_3', 'clave_4', 'clave_5', 'clave_6'];
  turnoSeleccionado!: Turno;
  mostrarVer: boolean = false;
  verHc: boolean = false;
  headerC1!: string;
  headerC2!: string;
  headerC3!: string;
  headerC4!: string;
  headerC5!: string;
  headerC6!: string;

  constructor(private db: FirestoreService,
              private spinner: SpinnerService,
              private swal: SwalService){}

  ngOnInit(): void {

    debugger;
    console.log('email: ', this.emailPaciente);
    console.log('idTurno: ', this.idTurno);

    this.spinner.mostrar();    
    this.db.obtenerTurnosPaciente(this.emailPaciente).subscribe( dbTurnos => {

        this.turnos = dbTurnos;
        debugger;
        if(this.idTurno != ''){
          let aux = this.turnos.filter((x) => x.id == this.idTurno);
          let data = this.dataFilterHc(aux);
          this.historiasClinicas = new MatTableDataSource(data);
        }
        else{
          let data = this.dataFilterHc(this.turnos);
          this.historiasClinicas = new MatTableDataSource(data);
        }

        console.log('historia clinica paciente: ', this.historiasClinicas);

        this.spinner.ocultar();
    });

  }

  
  private dataFilterUltimo(turnos: Turno[]){
    const hcSort = turnos.sort((a, b) => new Date(b.fecha).getTime() - (new Date(a.fecha)).getTime());

    if(hcSort.length > 1) {
      return hcSort.slice(0, 1);
    }

    return hcSort;
  }

  mostrarHistoriaClinica(id: string) {

    let auxTurno = new Turno();
    this.turnos?.forEach( t => {
      if(t.id === id){
        auxTurno = t;
      }
    });
  }

  private dataFilterHc(turnos: Turno[]){
    let array: HistoriaClinica[] = [];
    let data = <HistoriaClinica>{};
    debugger;

    let aux = turnos.filter((x) => x.historiaClinica != undefined)

    aux.forEach( t => {
      data = <HistoriaClinica>{
        altura: t.historiaClinica.altura,
        peso: t.historiaClinica.peso,
        temperatura: t.historiaClinica.temperatura,
        presion: t.historiaClinica.presion,
        clave_1: t.historiaClinica.clave_1,
        clave_2: t.historiaClinica.clave_2,
        clave_3: t.historiaClinica.clave_3,
        clave_4: t.historiaClinica.clave_4,
        clave_5: t.historiaClinica.clave_5,
        clave_6: t.historiaClinica.clave_6,
        valor_1: t.historiaClinica.valor_1,
        valor_2: t.historiaClinica.valor_2,
        valor_3: t.historiaClinica.valor_3,
        valor_4: t.historiaClinica.valor_4,
        valor_5: t.historiaClinica.valor_5,
        valor_6: t.historiaClinica.valor_6
  
      };

      array.push(data);
    });

    return array;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    
    if(this.historiasClinicas != null){
      this.historiasClinicas.filter = filterValue.trim().toLowerCase();

    }
  }

  cerrarHclinica(){
    this.viewHc.emit(false);
  }

}
