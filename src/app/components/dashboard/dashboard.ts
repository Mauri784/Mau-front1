import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

interface WeatherCard {
  icon: string;
  title: string;
  details: string[];
  color: string;
}

interface GeneralData {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  showMenu = false;
  lastUpdate = 'Cargando...';
  weatherCards: WeatherCard[] = [];
  generalData: GeneralData[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboardData();
    // Actualiza cada 15 minutos (900000 ms)
    interval(900000).subscribe(() => this.loadDashboardData());
  }

  /** 📡 Carga los datos del archivo JSON */
  loadDashboardData() {
    this.http.get<any[]>('WeatheriaBackend/weatheria/registros.json').subscribe({
      next: (data) => {
        if (!data?.length) return;
        const registro = data[data.length - 1];

        this.lastUpdate = `Última actualización: ${registro.timestamp}`;

        // 🌤️ Tarjetas principales (coinciden con el HTML)
        this.weatherCards = [
          {
            icon: '🌡️',
            title: `Temperatura: ${registro.temp}°C`,
            details: [
              `Sensación térmica: ${registro.heatIndex}°C`,
              `Punto de rocío: ${registro.dewpt}°C`,
              `Enfriamiento por viento: ${registro.windChill}°C`
            ],
            color: '#4A9EFF'
          },
          {
            icon: '💧',
            title: `Precipitación: ${registro.precipRate} mm/h`,
            details: [
              `Acumulado hoy: ${registro.precipTotal} mm`,
              `Probabilidad: ${(registro.precipRate > 0 ? 80 : 10)}%`,
              `Tipo: ${registro.precipRate > 0 ? 'Lluvia ligera' : 'Sin lluvia'}`
            ],
            color: '#4CAF50'
          },
          {
            icon: '⬇️',
            title: `Presión atmosférica: ${registro.pressure} hPa`,
            details: [
              `Presión registrada: ${registro.pressure} hPa`
            ],
            color: '#9C27B0'
          },
          {
            icon: '💨',
            title: `Viento: ${registro.windSpeed} km/h`,
            details: [
              `Ráfagas: ${registro.windGust} km/h`
            ],
            color: '#FF9800'
          }
        ];

        // 📋 Datos generales (para la tabla)
        this.generalData = [
          { label: 'Dewpoint', value: registro.dewpt },
          { label: 'HeatIndex', value: registro.heatIndex },
          { label: 'Humedad', value: `${registro.humidity}%` },
          { label: 'Presión (local)', value: registro.pressure },
          registro.pressureSeaLevel && { label: 'Presión (nivel del mar)', value: registro.pressureSeaLevel },
          { label: 'Precipitación', value: registro.precipRate },
          { label: 'Precipitación Total', value: registro.precipTotal },
          { label: 'Temperatura', value: registro.temp },
          { label: 'Sensación Térmica', value: registro.heatIndex },
          { label: 'Ráfagas', value: registro.windGust },
          { label: 'Velocidad del Viento', value: registro.windSpeed }
        ].filter(Boolean) as GeneralData[];
      },
      error: (err) => {
        console.error('Error al cargar registros.json', err);
        this.lastUpdate = 'Error al cargar los datos.';
      }
    });
  }

  /** 🎛️ Menú lateral */
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  /** 🔙 Navegación del menú */
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToHistorial() {
    this.router.navigate(['/historial']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  /** 🔙 Botón de volver (si lo agregas más adelante) */
  goBack() {
    this.router.navigate(['/home']);
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user'); 
  this.router.navigate(['/home']);
}

}
