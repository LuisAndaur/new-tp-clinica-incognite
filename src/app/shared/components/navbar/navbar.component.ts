import { animate, group, state, style, transition, trigger } from '@angular/animations';
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
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({
        width: '*',
        transform: 'translateX(0)', opacity: 1
      })),
      transition(':enter', [
        style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
        group([
          animate('0.3s 0.1s ease', style({
            transform: 'translateX(0)',
            width: '*'
          })),
          animate('0.3s ease', style({
            opacity: 1
          }))
        ])
      ]),
      transition(':leave', [
        group([
          animate('0.3s ease', style({
            transform: 'translateX(50px)',
            width: 10
          })),
          animate('0.3s 0.2s ease', style({
            opacity: 0
          }))
        ])
      ])
    ])
  ]
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
    console.log('CURRENT-USER: ', this.usuarioActual);

    this.auth.currentUser().subscribe((usuario) => {

      if(usuario != null){

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
