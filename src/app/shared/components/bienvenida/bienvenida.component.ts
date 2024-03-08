import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
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
