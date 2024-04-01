import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Encuesta } from 'src/app/shared/models/encuesta.class';
import { Turno } from 'src/app/shared/models/turno.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent implements OnInit {

  disabled = false;
  max = 10;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  r4_1=false;
  r4_2=false;
  r4_3=false;
  form!: FormGroup;

  @Input() turno!: Turno;
  @Output() mostrarCrear = new EventEmitter<boolean>();

  constructor(private db: FirestoreService,
              private router: Router,
              private swal: SwalService,
              private spinner: SpinnerService
            ) {}


  ngOnInit(){

    this.form = new FormGroup({
      r1: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(240)]),
      r2: new FormControl('', [Validators.required]),
      r3: new FormControl('', [Validators.required]),
      r5: new FormControl('', [Validators.required]),
    });
  }

  get getEncuesta(): Encuesta{
    let encuesta = new Encuesta();
    encuesta.r1 = this.r1?.value.toString();
    encuesta.r2 = this.r2?.value.toString();
    encuesta.r3 = this.r3?.value.toString();
    encuesta.r4_1 = this.r4_1;
    encuesta.r4_2 = this.r4_2;
    encuesta.r4_3 = this.r4_3;
    encuesta.r5 = this.r5?.value.toString();
    debugger;
    return encuesta;
  }

  seleccion(response: string){
    // this.r2 = response;
  }

  async submit() {
    if (this.form.valid) {

      console.log("ENCUESTA: ", this.getEncuesta);
      
      this.spinner.mostrar();
      debugger;
      const e = this.getEncuesta;
      this.turno.encuestaPaciente = e;

      await this.db.modificarTurno(this.turno)
              .then(()=>{
                this.swal.success("Se agregó la encuesta");
                
              })
              .catch((e:Error)=>{
                console.log("ERROR DENTRO DE GUARDAR ENCUESTA");
                this.swal.error(e.message);
              })
              .finally(()=>{
                this.form.reset();
                this.spinner.ocultar();
                this.mostrarCrear.emit(false);
                this.router.navigateByUrl('/mis-turnos');
              });
    }
    else{
      this.swal.error("Formulario inválido.");
    }
  }

  get r1() {
    return this.form.get('r1');
  }

  get r2() {
    return this.form.get('r2');
  }

  get r3() {
    return this.form.get('r3');
  }

  get r5() {
    return this.form.get('r5');
  }

  valor(){
    console.log("V6: ", this.r5?.value);
  }

}
