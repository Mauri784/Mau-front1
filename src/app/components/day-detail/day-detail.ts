import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface WeatherCard {
  icon: string;
  title: string;
  mainValue: string;
  details: string[];
  color: string;
}

interface GeneralData {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-day-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-detail.html',
  styleUrls: ['./day-detail.scss']
})
export class DayDetailComponent implements OnInit {
  selectedDate = 'Lunes 21 de septiembre de 2025';

  weatherCards: WeatherCard[] = [
    {
      icon: '🌡️',
      title: 'Temperatura 19°C',
      mainValue: '19°C',
      details: [
        'Sensación térmica: 17°C',
        'Punto de rocío: 14°C',
        'Enfriamiento por viento: 18°C'
      ],
      color: '#4A9EFF'
    },
    {
      icon: '💧',
      title: 'Precipitación 2.5 mm/h',
      mainValue: '2.5 mm/h',
      details: [
        'Acumulado hoy: 12.8 mm',
        'Probabilidad: 85%',
        'Tipo: Lluvia moderada'
      ],
      color: '#4CAF50'
    },
    {
      icon: '⬇️',
      title: 'Presión',
      mainValue: '1008.32 hPa',
      details: [],
      color: '#9C27B0'
    },
    {
      icon: '💨',
      title: 'Viento',
      mainValue: '9 km/h',
      details: [
        'Ráfagas: 9 km/h'
      ],
      color: '#FF9800'
    }
  ];

  generalData: GeneralData[] = [
    { label: 'Dewpoint', value: 11 },
    { label: 'HeatIndex', value: 22 },
    { label: 'Humedad', value: '46%' },
    { label: 'Presion', value: '1011.85' },
    { label: 'Precipitacion', value: 0 },
    { label: 'Precipitacion Total', value: 11 },
    { label: 'Temperatura', value: 11 },
    { label: 'Sensacion Termica', value: 11 },
    { label: 'Rafagas', value: 11 },
    { label: 'Velocidad del Viento', value: 11 }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/historial']);
  }

  downloadData() {
    alert('Descargando datos del día...');
    // Aquí va lógica para descargar los datos
  }
}