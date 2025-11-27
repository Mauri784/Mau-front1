import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DayRecord {
  id: number;
  date: string;
  filename: string;
  fullDate: Date;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.scss']
})
export class HistorialComponent implements OnInit {
  currentMonth = '';
  dayRecords: DayRecord[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadHistory();
  }

  /** 📂 Carga el index.json con los nombres de los CSV */
  async loadHistory() {
    try {
      // 📍 Nueva ruta adaptada
      const response = await fetch('WeatheriaBackend/weatheria/history/index.json');
      const data = await response.json();

      if (!data.files || !Array.isArray(data.files)) {
        console.error('index.json no contiene una lista válida de archivos.');
        return;
      }

      // 🗓️ Procesar los archivos CSV listados en el JSON
      this.dayRecords = data.files
        .filter((f: string) => f.endsWith('.csv'))
        .map((filename: string, i: number) => {
          const date = this.parseDateFromFilename(filename);
          return {
            id: i + 1,
            date: this.formatDateToSpanish(date),
            fullDate: date,
            filename
          };
        })
        .sort((a: any, b: any) => b.fullDate.getTime() - a.fullDate.getTime());

      if (this.dayRecords.length > 0) {
        this.currentMonth = this.dayRecords[0].fullDate.toLocaleString('es-ES', { month: 'long' });
        this.currentMonth =
          this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1);
      }
    } catch (err) {
      console.error('Error al cargar index.json:', err);
    }
  }

  /** 🧩 Convierte un nombre tipo 2025-11-10.csv a objeto Date */
  parseDateFromFilename(filename: string): Date {
    const baseName = filename.replace('.csv', '');
    const [year, month, day] = baseName.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /** 🗓️ Formatea fecha tipo "Lunes 10 de noviembre de 2025" */
  formatDateToSpanish(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  /** 🔙 Vuelve al dashboard */
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  /** ⬇️ Descarga el CSV del día seleccionado */
  viewDayDetail(day: DayRecord) {
    const url = `WeatheriaBackend/weatheria/history/${day.filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = day.filename;
    link.click();

    console.log('Descargando:', day.filename);
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.router.navigate(['/home']);
}

}
