import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {


  loginFrom : FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService : AuthService,
    private router : Router
  ) { }

  ngOnInit() {
    this.loginFrom = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  login(){
    if(this.loginFrom.invalid) return;

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    })


    const {correo, password} = this.loginFrom.value;
    this.authService.signInUsuario(correo,password).
      then(crendenciales=>{
        console.log(crendenciales);
        Swal.close();
        this.router.navigateByUrl('/');
      }).catch(err=>{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          });
      })
  }
}
