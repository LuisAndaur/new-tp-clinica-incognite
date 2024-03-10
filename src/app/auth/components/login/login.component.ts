import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { AuthService } from '../../services/auth.service';
import { RegistroIngresoService } from '../../services/registro-ingreso.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  constructor(private auth: AuthService,
              private db: FirestoreService,
              private router: Router,
              private swal: SwalService,
              private spinner: SpinnerService,
              private ingreso: RegistroIngresoService,
              private localStorage: LocalstorageService
            ) {}


  ngOnInit(){    
  
    this.form = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(6), Validators.maxLength(8)]}),
    });
  
  }

  
  async submit() : Promise<void> {
    if (this.form.valid) {
      this.spinner.mostrar();
      await this.auth.login(this.email?.value, this.password?.value)
            .then( async data => {
              const verificadoMail = data.user?.emailVerified;

              await this.db.obtenerUsuario(this.email?.value)
              .then(async user => {
                  if(user != null){

                    if(user['tipo'] == 'administrador'){
                      this.ingreso.setRegistroIngreso(this.email?.value);
                      this.localStorage.setItem('usuario', user);
                      console.log('Current: ', this.localStorage.getItem('usuario'));
                      this.swal.success('Bienvenido ' + user['nombre'] + '!');
                      this.router.navigateByUrl('/bienvenida');
                    }

                    if(verificadoMail){
                      if(user['tipo'] == 'paciente'){
                        if(user['estado'] == 'pendiente'){
                          let auxUser = new Usuario();
                          auxUser = user;
                          auxUser.estado = 'aceptado';
                          this.db.actualizarEstado(auxUser)
                        }
                        this.ingreso.setRegistroIngreso(this.email?.value);
                        this.localStorage.setItem('usuario', user);
                        console.log('Current: ', this.localStorage.getItem('usuario'));
                        this.swal.success('Bienvenido ' + user['nombre'] + '!');
                        this.router.navigateByUrl('/bienvenida');
                      }
                      else{
                        if(user['estado'] == 'aceptado'){
                          this.ingreso.setRegistroIngreso(this.email?.value);
                          this.localStorage.setItem('usuario', user);
                          console.log('Current: ', this.localStorage.getItem('usuario'));
                          this.swal.success('Bienvenido ' + user['nombre'] + '!');
                          this.router.navigate(['/bienvenida']);
                        }
                        else if(user['estado'] == 'pendiente'){
                          this.swal.info("El administrador no activó su cuenta");
                        }
                        else if(user['estado'] == 'rechazado'){
                          this.swal.info("Su cuenta ha sido rechazada.");
                        }
                        else{
                          this.auth.logout();
                          this.router.navigateByUrl('/bienvenida');
                        }
                      }
                    }
                    else{
                      this.auth.logout();
                      this.swal.warning("Falta validar el mail!");
                      this.router.navigateByUrl('/bienvenida');
                    }
                  }
              })

              
            })
            .catch((e:Error)=>{
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
  
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  autoCompletar(tipo: string) {
   if(tipo == 'paciente1'){
     this.form.controls['email'].setValue('yirzuritru@gufum.com');
     this.form.controls['password'].setValue('123123');
   }else if(tipo == 'paciente2'){
     this.form.controls['email'].setValue('molmusorki@gufum.com');
     this.form.controls['password'].setValue('123123');
   }else if(tipo == 'paciente3'){
     this.form.controls['email'].setValue('yarkedusta@gufum.com');
     this.form.controls['password'].setValue('123123');
   }else if(tipo == 'especialista1'){
     this.form.controls['email'].setValue('vadrovaydu@gufum.com');
     this.form.controls['password'].setValue('123123');
   }else if(tipo == 'especialista2'){
     this.form.controls['email'].setValue('kqozpnryazlvjyqyrc@cazlq.com');
     this.form.controls['password'].setValue('123123');
   }else if(tipo == 'administrador'){
     this.form.controls['email'].setValue('kepsezikke@gufum.com');
     this.form.controls['password'].setValue('123123');
   }else{
     this.swal.error("No existe");
   }
 }
}
