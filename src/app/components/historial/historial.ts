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

async loadHistory() {
  try {
    const response = await fetch(
      'https://weatheriadx-default-rtdb.firebaseio.com/csv_history.json'
    );

    const data = await response.json();

    if (!data) {
      console.error('No hay historial disponible.');
      return;
    }

    this.dayRecords = Object.keys(data).map((dateStr, i) => {
      const date = new Date(dateStr);
      return {
        id: i + 1,
        date: this.formatDateToSpanish(date),
        fullDate: date,
        filename: dateStr
      };
    }).sort((a, b) => b.fullDate.getTime() - a.fullDate.getTime());

    if (this.dayRecords.length > 0) {
      this.currentMonth = this.dayRecords[0].fullDate.toLocaleString('es-ES', { month: 'long' });
      this.currentMonth =
        this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1);
    }

  } catch (err) {
    console.error('Error al cargar historial:', err);
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

  goBack() {
    this.router.navigate(['/dashboard']);
  }

async viewDayDetail(day: DayRecord) {
  try {
    const url = `https://weatheriadx-default-rtdb.firebaseio.com/csv_history/${day.filename}.json`;

    const response = await fetch(url);
    const data = await response.json(); 

    if (!data || !Array.isArray(data)) {
      console.error('El archivo no contiene datos válidos.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(h => `"${row[h] ?? ''}"`);
      csvRows.push(values.join(','));
    }

    const csvText = csvRows.join('\n');

    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${day.filename}.csv`;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    console.error('Error al descargar CSV:', error);
  }
}



  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.router.navigate(['/home']);
}

}
