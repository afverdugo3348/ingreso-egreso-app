import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  registroFrom : FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService : AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registroFrom = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  crearUsuario(){
    if(this.registroFrom.invalid) return;
    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    })

    const { nombre, correo, password } = this.registroFrom.value;
    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales=>{
        console.log(credenciales);
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
