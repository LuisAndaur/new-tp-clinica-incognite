import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),
  ]
})
export class BienvenidaComponent implements OnInit {

  userCurrent!: boolean;

  constructor(private auth: AuthService){ }

  ngOnInit(): void {

    // this.auth.currentUser().subscribe((usuario) => {
    //   if(usuario != null){
    //     console.log('Current bienvenida: ', this.currentUser);
    //     this.currentUser = true;
    //   }
    // });
  }

  currentPadre(current: boolean){
    this.userCurrent = current;
  }

}
