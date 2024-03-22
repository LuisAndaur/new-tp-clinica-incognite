import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-resgistro-admin',
  templateUrl: './resgistro-admin.component.html',
  styleUrls: ['./resgistro-admin.component.scss']
})
export class ResgistroAdminComponent {

  form!: FormGroup;
  img1:any;

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
      especialidades: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagen1: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    }, [confirmPasswordValidator(), Validators.required]);
  }

  get getUsuario(): Usuario{
    let usuario = new Usuario();
    usuario.nombre = this.nombre?.value.toUpperCase();
    usuario.apellido = this.apellido?.value.toUpperCase();
    usuario.edad = this.edad?.value.toString();
    usuario.dni = this.dni?.value.toString();
    usuario.email = this.email?.value;
    usuario.password = this.password?.value;
    usuario.img = this.img1;
    return usuario;
  }

  async submit() {
    if (this.form.valid) {
      this.spinner.mostrar();
      await this.auth.verificationUser(this.email?.value, this.password?.value)
            .then( data => {
              debugger;
              const user = this.getUsuario;
              user.id = data.user?.uid;
              user.tipo = 'administrador';
              user.estado = 'aceptado';
              this.db.guardarAdministrador(user)
              .then(()=>{
                this.auth.logout();
                this.swal.success("Se registró al administrador");
                this.router.navigateByUrl('/bienvenida');
              })
              .catch((e:Error)=>{
                this.swal.error(e.message);
              })
              .finally(()=>{
                this.form.reset();
                this.auth.logout();
                this.spinner.ocultar();
              });

            })
            .catch((e:Error)=>{
              this.form.reset();
              this.swal.error(e.message);
            })
            .finally(()=>{
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

  get email() {
    return this.form.get('email');
  }

  get imagen1() {
    return this.form.get('imagen1');
  }

  get password() {
    return this.form.get('password');
  }

  get password2() {
    return this.form.get('password2');
  }

}
