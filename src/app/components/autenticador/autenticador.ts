import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/select';
import { Loginservice } from '../../services/loginservice';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { JwtRequestDTO } from '../../models/jwtRequestDTO';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-autenticador',
  imports: [FormsModule,MatInputModule,MatButtonModule,RouterModule],
  templateUrl: './autenticador.html',
  styleUrl: './autenticador.css',
})
export class Autenticador implements OnInit {

    showLogin = false;
  showRegister = false;
  
    constructor(
    private loginService: Loginservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  email: string = '';
  password: string = '';
  mensaje: string = '';

  ngOnInit(): void {}
  login() {
    let request = new JwtRequestDTO();
    request.email = this.email;
    request.password = this.password;
    this.loginService.login(request).subscribe(
      (data: any) => {
        sessionStorage.setItem('token', data.jwttoken);
      this.router.navigate(['/app/home']);
      },
      (error) => {
        this.mensaje = 'Credenciales incorrectas!!!';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      }
    );
  }
  closeAuth(): void {
    this.showLogin = false;
    this.showRegister = false;
  }
}
