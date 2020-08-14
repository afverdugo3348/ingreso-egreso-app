import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroFrom : FormGroup;
  cargando : boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService : AuthService,
    private router: Router,
    private store : Store<AppState>
  ) { }

  ngOnInit() {
    this.registroFrom = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.uiSubscription = this.store.select('ui').subscribe(ui=>{
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }
  crearUsuario(){
    if(this.registroFrom.invalid) return;
/*     Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    }) */

    this.store.dispatch(ui.isLoading());
    const { nombre, correo, password } = this.registroFrom.value;
    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales=>{
        console.log(credenciales);
        this.store.dispatch(ui.stopLoading());
        //Swal.close();
        this.router.navigateByUrl('/');
      }).catch(err=>{
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        });
    })
  }

}
