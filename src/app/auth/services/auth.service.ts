import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private auth: AngularFireAuth) {}

  login(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    localStorage.clear();
    return this.auth.signOut();
  }

  create(email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  currentUser(): Observable<any> {
    return this.auth.authState;
  }

  async verificationMail() {
    return (await this.auth.currentUser)?.sendEmailVerification();
  }

  async verificationUser(email: string, password: string): Promise<any> {
    const res = await this.create(email, password);
    this.verificationMail();
    return res;
  }

}
