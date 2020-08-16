import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;
  constructor(
    private store: Store<AppStateWithIngreso>,
    private ingresoEgresoService : IngresoEgresoService
  ) { }

  ngOnInit() {
    this.ingresosSubs = this.store.select('ingresosEgresos').subscribe(({items})=> this.ingresosEgresos = items)
  }
  ngOnDestroy(){
    this.ingresosSubs.unsubscribe();
  }

  borrar(uid: string){ 
      this.ingresoEgresoService.borrarIngresoEgreso(uid).then(()=> Swal.fire('Borrado','Item borrado','success'))
      .catch(err=>Swal.fire('Error', err.message,'error'));
  }

}
