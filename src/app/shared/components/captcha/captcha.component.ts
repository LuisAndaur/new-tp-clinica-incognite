import { Component } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent {
  captchaText: string = '';
  userAnswer: string = '';
  captchaOk: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      this.captchaText += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
  }

  onSubmit(): void {
    if (this.userAnswer.toLowerCase() === this.captchaText.toLowerCase()) {
      this.captchaOk = true;
      console.log('¡CAPTCHA correcto!');
    } else {
      this.captchaOk = false;
      console.log('Respuesta incorrecta. Por favor, inténtalo de nuevo.');
      this.generateCaptcha();
      this.userAnswer = '';
    }
  }
}
