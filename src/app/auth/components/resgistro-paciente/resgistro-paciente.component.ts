import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/shared/models/paciente.class';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@Component({
  selector: 'app-resgistro-paciente',
  templateUrl: './resgistro-paciente.component.html',
  styleUrls: ['./resgistro-paciente.component.scss']
})
export class ResgistroPacienteComponent {

  form!: FormGroup;
  img1:any;
  img2:any;

  constructor(private auth: AuthService,
              private db: FirestoreService,
              private router: Router,
              private swal: SwalService,
              private spinner: SpinnerService
            ) {}


  ngOnInit(){
    this.form = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
      dni: new FormControl('', [Validators.required, Validators.min(11111111), Validators.max(99999999)]),
      obraSocial: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagen1: new FormControl('', [Validators.required]),
      imagen2: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    }, [confirmPasswordValidator(), Validators.required]);
  }

  get getUsuario(): Paciente{
    let paciente = new Paciente();
    paciente.nombre = this.nombre?.value.toUpperCase();
    paciente.apellido = this.apellido?.value.toUpperCase();
    paciente.edad = this.edad?.value.toString();
    paciente.dni = this.dni?.value.toString();
    paciente.obraSocial = this.obraSocial?.value.toUpperCase();
    paciente.email = this.email?.value;
    paciente.password = this.password?.value;
    paciente.img = this.img1;
    paciente.img2 = this.img2;
    return paciente;
  }

  async submit() {
    if (this.form.valid) {
      this.spinner.mostrar();
      debugger;
      await this.auth.verificationUser(this.email?.value, this.password?.value)
            .then( data => {
              
              const user = this.getUsuario;
              user.id = data.user?.uid;
              user.tipo = 'paciente';
              user.estado = 'pendiente';
              this.db.guardarPaciente(user)
              .then(()=>{
                this.swal.success("Se registró el paciente");
                
              })
              .catch((e:Error)=>{
                console.log("ERROR DENTRO DE GUARDAR PACIENTE");
                this.swal.error(e.message);
              })
              .finally(()=>{
                this.form.reset();
                this.auth.logout();
                this.spinner.ocultar();
                this.router.navigateByUrl('/bienvenida');
              });

            })
            .catch((e:Error)=>{
              this.form.reset();
              this.swal.error(e.message);
            })
            .finally(()=>{
              this.auth.logout();
              this.spinner.ocultar();
            });
    }
    else{
      this.swal.error("Formulario inválido.");
    }
  }

  cargarImg(index:number){

    let rand = this.db.generarRandom(16);

    if(index == 0){

      var blob = this.imagen1?.value.slice(0, this.imagen1?.value.size, this.imagen1?.value.type); 
      var newFile = new File([blob], rand+'.jpg', {type: 'image/jpg'});
      
      this.img1 = newFile;
    }
    else{
      var blob = this.imagen2?.value.slice(0, this.imagen2?.value.size, this.imagen2?.value.type); 
      var newFile = new File([blob], rand+'.jpg', {type: 'image/jpg'});
      
      this.img2 = newFile;
    }
  }

  get nombre() {
    return this.form.get('nombre');
  }

  get apellido() {
    return this.form.get('apellido');
  }

  get edad() {
    return this.form.get('edad');
  }

  get dni() {
    return this.form.get('dni');
  }

  get obraSocial() {
    return this.form.get('obraSocial');
  }

  get email() {
    return this.form.get('email');
  }

  get imagen1() {
    return this.form.get('imagen1');
  }

  get imagen2() {
    return this.form.get('imagen2');
  }

  get password() {
    return this.form.get('password');
  }

  get password2() {
    return this.form.get('password2');
  }
}
