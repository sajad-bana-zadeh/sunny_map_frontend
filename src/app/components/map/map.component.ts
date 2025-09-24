import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { PointService, Point, DensityData } from '../../services/point.service';
import { SearchPanelComponent } from '../search-panel/search-panel.component';
import { PointDetailsComponent } from '../point-details/point-details.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, SearchPanelComponent, PointDetailsComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private densityLayers: L.Polygon[] = [];
  private selectedLocation: L.LatLng | null = null;
  private selectionMarker: L.Marker | null = null;

  points: Point[] = [];
  selectedPoint: (Point & { distance: string }) | null = null;

  constructor(private pointService: PointService) {}

  ngOnInit(): void {
    // Fix Leaflet icon issue
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadPoints();
    this.loadDensity();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [40.7128, -74.0060],
      zoom: 11
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add click handler for location selection
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.selectLocation(e.latlng);
    });
  }

  private selectLocation(latlng: L.LatLng): void {
    this.selectedLocation = latlng;
    
    // Remove previous selection marker
    if (this.selectionMarker) {
      this.map.removeLayer(this.selectionMarker);
    }

    // Add new selection marker
    this.selectionMarker = L.marker(latlng, {
      icon: L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        className: 'selection-marker'
      })
    }).addTo(this.map);

    this.selectionMarker.bindPopup('Search location selected').openPopup();
  }

  private loadPoints(): void {
    this.pointService.getAllPoints().subscribe(points => {
      this.points = points;
      this.displayPoints();
    });
  }

  private displayPoints(): void {
    // Clear existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Add markers for each point
    this.points.forEach(point => {
      const marker = L.marker([point.latitude, point.longitude])
        .bindPopup(this.createPopupContent(point))
        .addTo(this.map);
      
      this.markers.push(marker);
    });
  }

  private createPopupContent(point: Point): string {
    const inventoryHtml = point.inventory
      .map(item => `<li>${item.productName} (${item.productType}): ${item.quantity}</li>`)
      .join('');
    
    return `
      <div class="point-popup">
        <h5>${point.name}</h5>
        <p><strong>Inventory:</strong></p>
        <ul>${inventoryHtml}</ul>
        <p>
          📧 ${point.contactInfo.email}<br>
          📞 ${point.contactInfo.phone}
        </p>
      </div>
    `;
  }

  private loadDensity(): void {
    this.pointService.getDensity().subscribe(densityData => {
      this.displayDensity(densityData);
    });
  }

  private displayDensity(densityData: DensityData[]): void {
    // Clear existing density layers
    this.densityLayers.forEach(layer => this.map.removeLayer(layer));
    this.densityLayers = [];

    // Add density polygons
    densityData.forEach(area => {
      const color = this.getDensityColor(area.pointCount);
      
      if (color !== 'transparent') {
        const polygon = L.polygon(
          area.boundaryCoordinates.map(coord => [coord[0], coord[1]] as L.LatLngTuple),
          {
            color: color,
            fillColor: color,
            fillOpacity: 0.3,
            weight: 1
          }
        ).addTo(this.map);

        polygon.bindTooltip(`${area.pointCount} points`);
        this.densityLayers.push(polygon);
      }
    });
  }

  private getDensityColor(count: number): string {
    if (count === 0) return 'transparent';
    if (count === 1) return '#ffeda0';
    if (count === 2) return '#fed976';
    if (count === 3) return '#feb24c';
    if (count === 4) return '#fd8d3c';
    if (count === 5) return '#fc4e2a';
    return '#bd0026';
  }

  onSearch(criteria: { productName: string; productType: string }): void {
    if (!this.selectedLocation) {
      alert('Please click on the map to select a search location');
      return;
    }

    this.pointService.findClosestPoint(
      criteria.productName,
      criteria.productType,
      this.selectedLocation.lat,
      this.selectedLocation.lng
    ).subscribe(
      point => {
        this.selectedPoint = point;
        this.highlightPoint(point);
      },
      error => {
        alert('No matching points found');
      }
    );
  }

  private highlightPoint(point: Point & { distance: string }): void {
    // Create highlighted marker
    const highlightedMarker = L.marker([point.latitude, point.longitude], {
      icon: L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [35, 51],
        iconAnchor: [17, 51],
        className: 'highlighted-marker'
      })
    }).addTo(this.map);

    // Bind popup with distance info
    highlightedMarker.bindPopup(`
      <div class="closest-point-popup">
        <h5>${point.name}</h5>
        <p><strong>Distance:</strong> ${point.distance}</p>
        <p>📧 ${point.contactInfo.email}<br>📞 ${point.contactInfo.phone}</p>
      </div>
    `).openPopup();

    // Pan to the point
    this.map.panTo([point.latitude, point.longitude]);

    // Remove highlight after 10 seconds
    setTimeout(() => {
      this.map.removeLayer(highlightedMarker);
    }, 10000);
  }
}
