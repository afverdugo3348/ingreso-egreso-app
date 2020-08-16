import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import { unSetItems } from '../ingreso-egreso/ingreso-egreso.actions';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription : Subscription;
  private _user : Usuario;

  get user(){
    return this._user;
  }
  constructor(public auth: AngularFireAuth,
    public db : AngularFirestore,
    private store: Store<AppState> ) { }

  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      if(fuser){
        this.userSubscription = this.db.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe( (firestoreUser: any) =>{
          const user = Usuario.fromFirebase(firestoreUser);
          this._user = user;
          this.store.dispatch(setUser({user}));
        })
      }else{
        this._user = null;
        this.userSubscription? this.userSubscription.unsubscribe(): "";
        this.store.dispatch(unSetUser());
        this.store.dispatch(unSetItems());
      }
    });
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
