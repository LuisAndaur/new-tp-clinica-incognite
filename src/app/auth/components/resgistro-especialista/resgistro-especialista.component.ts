import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CaptchaDirective } from 'src/app/shared/directives/captcha.directive';
import { Especialidad } from 'src/app/shared/models/especialidad.class';
import { Especialista } from 'src/app/shared/models/especialista.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-resgistro-especialista',
  templateUrl: './resgistro-especialista.component.html',
  styleUrls: ['./resgistro-especialista.component.scss'],
  animations: [
    trigger('routeAnimation', [
      state('*', style({
        opacity: 1, transform: 'perspective(500px) translateZ(0px)'
      })),
      transition(':enter', [
        style({ 
          opacity: 0, transform: 'perspective(500px) translateZ(-400px)'
        }), 
        animate('3s ease')
      ]),
      transition(':leave', [
        animate('3s ease', 
          style({ 
            opacity: 0, transform: 'perspective(500px) translateZ(-400px)'
          }))
      ])
    ])

  ]
})
export class ResgistroEspecialistaComponent implements OnInit {

  form!: FormGroup;
  img1:any;
  listaEspecialidades: Array<Especialidad> = [];
  especialidadesElegidas: Array<Especialidad> = [];
  faltaCargarEspecialidades: boolean = true;
  nuevaEspecialidad:string = ''; 
  especialidadElegida:string = '';
  speciality!: string;
  isChecked: boolean = false;
  captchaCode: string = '';
  isCaptcha!: boolean;
  myCaptcha!: string;
  regenerate: boolean = false;
  insertUser: string = '';
  isOk: boolean = false;

  constructor(private auth: AuthService,
              private db: FirestoreService,
              private router: Router,
              private swal: SwalService,
              private spinner: SpinnerService
            ) {}


  ngOnInit(){

    this.db.obtenerEspecialidades().subscribe((e) => {
      this.faltaCargarEspecialidades = !e;
      console.log("Especialidades: ", e);
      this.listaEspecialidades = e;

      // if(!this.especialidad){
      //   this.seterSelectEspecialidades();
      // }
    });

    this.form = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
      dni: new FormControl('', [Validators.required, Validators.min(11111111), Validators.max(99999999)]),
      // especialidad: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagen1: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    }, [confirmPasswordValidator(), Validators.required]);
  }

  get getUsuario(): Especialista{
    let especialista = new Especialista();
    especialista.nombre = this.nombre?.value.toUpperCase();
    especialista.apellido = this.apellido?.value.toUpperCase();
    especialista.edad = this.edad?.value.toString();
    especialista.dni = this.dni?.value.toString();
    especialista.especialidades = this.especialidadesElegidas;
    especialista.email = this.email?.value;
    especialista.password = this.password?.value;
    especialista.img = this.img1;
    return especialista;
  }

  async submit() {
    debugger;
    if (this.form.valid) {
      if(this.isChecked){
        if(!this.isCaptcha){
          this.swal.warning('Complete el CAPTCHA!');
          return;
        }
      }

      if(this.especialidadesElegidas.length<1 ){
        this.swal.warning('Seleccione una ESPECIALIDAD!');
        return;
      }
      
      this.spinner.mostrar();
      await this.auth.verificationUser(this.email?.value, this.password?.value)
            .then( data => {
              debugger;
              const user = this.getUsuario;
              user.id = data.user?.uid;
              user.tipo = 'especialista';
              user.estado = 'pendiente';
              this.db.guardarEspecialista(user)
              .then(()=>{
                this.auth.logout();
                this.swal.success("Se registró el especialista");
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
      this.swal.warning("Complete el formulario!");
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

  existeEspecialidad(especialidad: string){
    let flag = false;

    this.listaEspecialidades.forEach( e => {
      // if(e.especialidad==especialidad){a.localeCompare(b, 'es', { sensitivity: 'base' }) === 0
      if(e.especialidad.localeCompare(especialidad, 'es', { sensitivity: 'base' }) === 0){
        flag = true;
      }
    });

    return flag;
  }

  seleccion(user: string){
    this.especialidadElegida = user;
  }

  sumarEspecialidad(){
debugger;
    let flag = false;

    this.especialidadesElegidas.forEach( e => {
      if(e.id.toString()==this.especialidadElegida){
        flag = true;
        this.swal.error('La especialidad ya se encuentra añadida.');
      }
    });

    if(this.especialidadElegida == ''){
      this.swal.error('Elija una especialidad.');

    }
    else{
      
      if(!flag){
        this.listaEspecialidades.forEach( e => {
  
          if (e.id.toString()==this.especialidadElegida){
  
            this.especialidadesElegidas.push(e);
          }
        })
      }
    }

  }

  restarEspecialidad(){

    let flag = false;

    this.especialidadesElegidas.forEach( e => {
      if(e.id.toString()==this.especialidadElegida){
        flag = true;
      }
    });
    
    if(flag){
      const aux = this.especialidadesElegidas.filter(e => e.id.toString() != this.especialidadElegida);
      this.especialidadesElegidas = aux;
    }

  }

  agregarEspecialidad(){
    debugger;

    if(this.nuevaEspecialidad!=''){

      if(this.existeEspecialidad(this.nuevaEspecialidad.toUpperCase())){
        this.swal.info("La especialidad ya existe.");
      }
      else{
        this.spinner.mostrar();
        this.db.guardarEspecialidad(this.nuevaEspecialidad.toUpperCase())
        .then(()=>{
          this.swal.success("Se agregó la especialidad");

        })
        .catch((e:Error)=>{
          console.log("Guardar especialidad: ");
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.nuevaEspecialidad ='';
          this.spinner.ocultar();
        })
      }
    }
    else{
      this.swal.error('Escriba una especialidad para agregar.');
    }
  }

  onCaptchaGenerador(code: string): void {
    debugger;
    this.captchaCode = code;
    console.log('CaptchaGenerete: ', this.captchaCode);
  }

  onCaptchaVerificador(isVerified: boolean): void {
    if (isVerified) {
      console.log('Captcha verificado correctamente');
      console.log('CaptchaVerificate OK: ', this.captchaCode);
      this.isCaptcha = isVerified;
    } else {
      console.log('Captcha incorrecto');
      console.log('CaptchaVerificate BAD: ', this.captchaCode);
      this.isCaptcha = isVerified;
    }
  }

  verificar(){
    if (this.isCaptcha) {
      this.regenerate = false;
      this.isOk = true;
      this.swal.success('¡CAPTCHA correcto!');
    } 
    else {
      this.regenerate = true;
      this.isOk = false;
      this.swal.error('¡CAPTCHA incorrecto! Intentalo de nuevo.');
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

  // get especialidad() {
  //   return this.form.get('especialidad');
  // }

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
