import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private isLoaded = false;
  private loadingPromise: Promise<boolean> | null = null;

  loadGoogleMaps(): Promise<boolean> {
    if (this.loadingPromise) return this.loadingPromise;
    if (this.isLoaded) return Promise.resolve(true);

    this.loadingPromise = new Promise<boolean>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCPpRXXUwhuXmx_ufl7UPGFtcYm4kCWI5U&libraries=geometry,marker';  // Tu key + libraries
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        resolve(true);
      };
      script.onerror = () => reject(new Error('Error loading Google Maps API'));
      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }
}