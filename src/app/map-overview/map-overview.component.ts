import { Component, inject, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';

interface Platform {
  name: string;
  lat: number;
  lng: number;
  subText: string;
}

@Component({
  selector: 'app-map-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-overview.component.html',
  styleUrls: ['./map-overview.component.scss']
})
export class MapOverviewComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: L.Map;

  selectedPlatform?: Platform;
  showPopup = false;
  popupX = 0;
  popupY = 0;

  center = { lat: 3.627644, lng: 112.677713 };

  platforms: Platform[] = [
    {
      name: 'Golok',
      lat: 3.627644,
      lng: 112.677713,
      subText: 'SA-SA Platform • SK311'
    },
    {
      name: 'Merapuh',
      lat: 3.657644,
      lng: 112.707713,
      subText: 'SA-SA Platform • SK311'
    },
    {
      name: 'Serampang',
      lat: 3.657644,
      lng: 112.547713,
      subText: 'SA-SA Platform • SK311'
    }
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.center.lat, this.center.lng],
      zoom: 10,
      zoomControl: true,
      doubleClickZoom: false
    });

    // Esri World Imagery (satellite) tile layer
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 17,
        minZoom: 5
      }
    ).addTo(this.map);

    // Custom oil rig icon
    const oilRigIcon = L.icon({
      iconUrl: 'assets/images/oilrig-marker.png',
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -65]
    });

    // Add markers for each platform
    this.platforms.forEach(platform => {
      const marker = L.marker([platform.lat, platform.lng], { icon: oilRigIcon });

      // Custom popup HTML
      const popupContent = `
        <div style="
          background: #111827;
          color: white;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          border: 1px solid rgba(255,255,255,0.1);
          font-family: inherit;
        ">
          <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0 0 4px 0;">${platform.name}</h3>
          <p style="font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 16px 0;">${platform.subText}</p>
          <button
            onclick="window.__leafletNavigate()"
            style="
              width: 100%;
              padding: 8px 0;
              background: hsl(221, 83%, 53%);
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 700;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              font-size: 0.9rem;
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Go to Platform
          </button>
        </div>
      `;

      // Register global navigate handler for popup button
      (window as any).__leafletNavigate = () => {
        this.router.navigate(['/inspection-status']);
      };

      marker
        .bindPopup(popupContent, {
          className: 'custom-leaflet-popup',
          closeButton: true
        })
        .on('dblclick', (e: L.LeafletMouseEvent) => {
          marker.openPopup();
        })
        .on('click', (e: L.LeafletMouseEvent) => {
          this.selectedPlatform = platform;
          marker.openPopup();
        });

      marker.addTo(this.map);

      // Add a divIcon label below the marker
      const label = L.divIcon({
        className: 'platform-label',
        html: `<span style="
          color: white;
          font-weight: 700;
          font-size: 13px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8);
          white-space: nowrap;
          display: block;
          text-align: center;
        ">${platform.name}</span>`,
        iconAnchor: [-5, -5]
      });
      L.marker([platform.lat, platform.lng], { icon: label, interactive: false }).addTo(this.map);
    });
  }

  navigateToMonitor() {
    this.router.navigate(['/dashboard']);
  }
}
