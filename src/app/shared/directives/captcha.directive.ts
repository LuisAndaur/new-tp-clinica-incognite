import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[myCaptcha]'
})
export class CaptchaDirective {

  private _regenerate!: boolean;
  @Input() myCaptcha!: string;

  @Input() set regenerate(param: boolean){
    this._regenerate = param;
    console.log("Estoy en el input: ",param);
    if(this._regenerate){
      this.captchaCode = this.generateCaptchaCode();
      this.captchaCodeGenerated.emit(this.captchaCode);
    }
  };

  get regenerate(): boolean{
    return this._regenerate;
  }
  @Output() captchaCodeGenerated = new EventEmitter<string>();
  @Output() captchaVerified = new EventEmitter<boolean>();
  captchaCode!: string;

  constructor() { }

  ngOnInit() {
    this.captchaCode = this.generateCaptchaCode();
    this.captchaCodeGenerated.emit(this.captchaCode);
  }

  @HostListener('input', ['$event.target.value', '$event.target.dataset.captcha'])
  onInputChange(userInput: string): void {
    this.captchaVerified.emit(userInput === this.captchaCode);
  }

  private generateCaptchaCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 6;
    let captcha = '';
    for (let i = 0; i < length; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  }
}
