import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
    public db : AngularFirestore) { }

  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      console.log(fuser);
    })
  }
  crearUsuario(nombre: string, email: string, password: string){
    return this.auth.auth.createUserWithEmailAndPassword(email, password)
    .then( ({ user })=> {
      const newUser = new Usuario( user.uid, nombre, user.email );
      return this.db.doc(`${ user.uid }/usuario`)
        .set({...newUser});
    });
  }
  signInUsuario(email: string, password: string){
    return this.auth.auth.signInWithEmailAndPassword(email, password)
  }
  logout(){
    return this.auth.auth.signOut();
  }
  isAuth(){
    return this.auth.authState.pipe(
      map(fuser=> fuser!= null)
    );
  }
}
