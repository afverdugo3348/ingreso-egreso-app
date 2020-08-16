import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando : boolean = false;
  loginFrom : FormGroup;
  uiSubscription : Subscription;
  constructor(
    private fb: FormBuilder,
    private authService : AuthService,
    private router : Router,
    private store : Store<AppState> 
  ) { }

  ngOnInit() {
    this.loginFrom = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui =>{
                          this.cargando = ui.isLoading;
                        });
  }
  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }
  login(){
    if(this.loginFrom.invalid) return;

    this.store.dispatch(ui.isLoading());
/* 
    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    }) */


    const {correo, password} = this.loginFrom.value;
    this.authService.signInUsuario(correo,password).
      then(crendenciales=>{
        console.log(crendenciales);
        //Swal.close();
        this.store.dispatch(ui.stopLoading());
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
