import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Usuario } from '../../models/usuario.class';
import { LocalstorageService } from '../../services/localstorage.service';
import { SpinnerService } from '../../services/spinner.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  usuarioActual!: any;
  currentUser!: boolean;
  usuario!: Usuario;
  userCurrent!: string;
  @Output() currentHijo = new EventEmitter<boolean>();

  constructor(private auth: AuthService,
              private router: Router,
              private spinner: SpinnerService,
              private localStorage: LocalstorageService,
              private swal: SwalService){}

  ngOnInit(): void {
    this.currentUser = false;
    this.currentHijo.emit(this.currentUser);

    this.usuarioActual = this.localStorage.getItem('usuario');

    this.auth.currentUser().subscribe((usuario) => {
      console.log('CURRENT-USER-NAV: ', usuario);
      if(usuario != null){
        console.log('CURRENT-USER-NAV: ', usuario);
        this.currentUser = true;
        this.currentHijo.emit(this.currentUser);
        this.usuario = usuario;

        let aux = this.usuario.email.split('@');
        this.userCurrent = aux[0];
      }
    });
  }

  logout(): void {

    this.spinner.mostrar();
    setTimeout(() => {
      this.auth.logout()
        .then(() => {
          this.ngOnInit();
          this.currentHijo.emit(this.currentUser);
          this.router.navigateByUrl('/');
        })
        .catch((e) => {
          this.swal.error(e.message);
        })
        .finally(() => {
          this.spinner.ocultar();
        });
    }, 1000);
  }

}
