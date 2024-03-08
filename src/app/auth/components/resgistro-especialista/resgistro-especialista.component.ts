import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/shared/models/especialidad.class';
import { Especialista } from 'src/app/shared/models/especialista.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-resgistro-especialista',
  templateUrl: './resgistro-especialista.component.html',
  styleUrls: ['./resgistro-especialista.component.scss']
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
      if(e.especialidad==especialidad){
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

    if(this.nuevaEspecialidad!=''){

      if(this.existeEspecialidad(this.nuevaEspecialidad)){
        this.swal.info("La especialidad ya existe.");
      }
      else{
        this.spinner.mostrar();
        this.db.guardarEspecialidad(this.nuevaEspecialidad.toUpperCase())
        .then(()=>{
          this.swal.success("Se agregó la especialidad");

        })
        .catch((e:Error)=>{
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

  private seterSelectEspecialidades(): void {

    if(this.faltaCargarEspecialidades == false){
        const largo = this.listaEspecialidades.length -1;
        const especialidad = this.listaEspecialidades[largo].especialidad;

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
