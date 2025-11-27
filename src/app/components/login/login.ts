import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    if (!this.usuario || !this.contrasena) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        if (response.statusCode === 200) {
         
          this.router.navigate(['/dashboard']);
        } else {
          alert(response.intData.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al iniciar sesión');
      }
    });
  }
}
