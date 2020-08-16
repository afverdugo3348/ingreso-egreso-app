import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
    private auth : AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    return this.firestore.doc(`${this.auth.user.uid}/ingreso-egreso`).collection('items')
    .add({...ingresoEgreso});

  }

  initIngresosEgresosListener(uid: string){
    return this.firestore.collection(`${uid}/ingreso-egreso/items`)
    .snapshotChanges()
    .pipe(
      map(snapshot=> snapshot.map(doc=>({
            ...doc.payload.doc.data(),
            uid : doc.payload.doc.id
          })
        )
      )
    );
  }

  borrarIngresoEgreso(uidItem: string){
    return this.firestore.doc(`${this.auth.user.uid}/ingreso-egreso/items/${uidItem}`).delete();
  }
}
