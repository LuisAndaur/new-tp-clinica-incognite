import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public translate: TranslateService) {

    translate.addLangs(['es', 'en', 'po']);
    const lang = translate.getBrowserLang()
    translate.setDefaultLang('es');
    if( (lang !== 'es') && ( lang !== 'en') && ( lang !== 'po') ){
      translate.setDefaultLang('es');
      console.log('SET LANGUAJES: ', lang);
    }
  }

  title = 'clinica';
}
