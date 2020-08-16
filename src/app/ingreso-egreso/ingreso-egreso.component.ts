import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { isLoading, stopLoading } from '../shared/ui.actions';
import { Subscription } from 'rxjs';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm : FormGroup;
  tipo: string = 'ingreso';
  cargando : boolean = false;
  uiSubscription : Subscription;

  constructor(private fb: FormBuilder,
    private ingresoEgresoService : IngresoEgresoService,
    private store : Store<AppState>) { }

  ngOnInit() {
    this.ingresoForm = this.fb.group({
      descripcion : ['', Validators.required],
      monto : ['', Validators.required]
    });
    this.uiSubscription = this.store.select('ui').subscribe((state)=>{
      this.cargando = state.isLoading;
    });
  }
  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }
  guardar(){
    this.store.dispatch(isLoading());
   
    if(this.ingresoForm.invalid) return;
    const {descripcion, monto} = this.ingresoForm.value;
    
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then(()=>{
      this.store.dispatch(stopLoading());
      this.ingresoForm.reset();
      Swal.fire('Registro creado',descripcion,'success')
    }).catch(err=> {
      Swal.fire('Error',err.message,'error')
      this.store.dispatch(stopLoading());
    });
  }

}
