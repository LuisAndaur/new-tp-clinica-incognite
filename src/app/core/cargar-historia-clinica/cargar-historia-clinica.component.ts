import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HistoriaClinica } from 'src/app/shared/models/historia-clinica.class';
import { Turno } from 'src/app/shared/models/turno.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-cargar-historia-clinica',
  templateUrl: './cargar-historia-clinica.component.html',
  styleUrls: ['./cargar-historia-clinica.component.scss']
})
export class CargarHistoriaClinicaComponent {

  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  form!: FormGroup;
  valor_6_isChecked = false;
  @Input() turno!: Turno;
  @Output() mostrarCrear = new EventEmitter<boolean>();

  constructor(private db: FirestoreService,
              private router: Router,
              private swal: SwalService,
              private spinner: SpinnerService
            ) {}


  ngOnInit(){

    this.form = new FormGroup({
      altura: new FormControl('', [Validators.required, Validators.min(10), Validators.max(240)]),
      peso: new FormControl('', [Validators.required, Validators.min(1), Validators.max(220)]),
      temperatura: new FormControl('', [Validators.required, Validators.min(32), Validators.max(46)]),
      presion: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
      clave_1: new FormControl('', [Validators.required]),
      valor_1: new FormControl('', [Validators.required]),
      clave_2: new FormControl('', [Validators.required]),
      valor_2: new FormControl('', [Validators.required]),
      clave_3: new FormControl('', [Validators.required]),
      valor_3: new FormControl('', [Validators.required]),
      clave_4: new FormControl('', [Validators.required]),
      valor_4: new FormControl('', [Validators.required]),
      clave_5: new FormControl('', [Validators.required]),
      valor_5: new FormControl('', [Validators.required, Validators.min(1), Validators.max(1000)]),
      clave_6: new FormControl('', [Validators.required]),
      valor_6: new FormControl('', [Validators.required]),
    });
  }

  get getHistoriaClinica(): HistoriaClinica{
    let historiaclinica = new HistoriaClinica();
    historiaclinica.altura = this.altura?.value.toString();
    historiaclinica.peso = this.peso?.value.toString();
    historiaclinica.temperatura = this.temperatura?.value.toString();
    historiaclinica.presion = this.presion?.value.toString();
    historiaclinica.clave_1 = this.clave_1?.value.toString().toUpperCase();
    historiaclinica.valor_1 = this.valor_1?.value.toString();
    historiaclinica.clave_2 = this.clave_2?.value.toString().toUpperCase();
    historiaclinica.valor_2 = this.valor_2?.value.toString();
    historiaclinica.clave_3 = this.clave_3?.value.toString().toUpperCase();
    historiaclinica.valor_3 = this.valor_3?.value.toString();
    historiaclinica.clave_4 = this.clave_4?.value.toString().toUpperCase();
    historiaclinica.valor_4 = this.valor_4?.value.toString();
    historiaclinica.clave_5 = this.clave_5?.value.toString().toUpperCase();
    historiaclinica.valor_5 = this.valor_5?.value.toString();
    historiaclinica.clave_6 = this.clave_6?.value.toString().toUpperCase();
    historiaclinica.valor_6 = this.valor_6?.value ? 'Si' : 'No';
    debugger;
    return historiaclinica;
  }

  async submit() {
    this.spinner.mostrar();
    if (this.form.valid) {     
      
      debugger;
      const hc = this.getHistoriaClinica;
      this.turno.historiaClinica = hc;

      await this.db.modificarTurno(this.turno)
              .then(()=>{
                this.spinner.ocultar();
                this.swal.success("Se agregó la historia clínica");
                
              })
              .catch((e:Error)=>{
                console.log("ERROR DENTRO DE GUARDAR HISTORIA CLINICA");
                this.spinner.ocultar();
                this.swal.error('ERROR DENTRO DE GUARDAR HISTORIA CLINICA');
                console.log(e.message);
              })
              .finally(()=>{
                this.form.reset();
                this.mostrarCrear.emit(false);
                
                this.router.navigateByUrl('/mis-turnos');
              });
    }
    else{
      this.swal.error("Formulario inválido.");
      this.spinner.ocultar();
    }
  }

  cancelar() {
    this.mostrarCrear.emit(false);
    this.router.navigateByUrl('/mis-turnos');
  }

  get altura() {
    return this.form.get('altura');
  }

  get peso() {
    return this.form.get('peso');
  }

  get temperatura() {
    return this.form.get('temperatura');
  }

  get presion() {
    return this.form.get('presion');
  }

  get clave_1() {
    return this.form.get('clave_1');
  }

  get valor_1() {
    return this.form.get('valor_1');
  }

  get clave_2() {
    return this.form.get('clave_2');
  }

  get valor_2() {
    return this.form.get('valor_2');
  }

  get clave_3() {
    return this.form.get('clave_3');
  }

  get valor_3() {
    return this.form.get('valor_3');
  }

  get clave_4() {
    return this.form.get('clave_4');
  }

  get valor_4() {
    return this.form.get('valor_4');
  }

  get clave_5() {
    return this.form.get('clave_5');
  }

  get valor_5() {
    return this.form.get('valor_5');
  }

  get clave_6() {
    return this.form.get('clave_6');
  }

  get valor_6() {
    return this.form.get('valor_6');
  }

  valor(){
    console.log("V6: ", this.valor_6?.value);
  }

}

