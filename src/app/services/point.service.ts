import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Point {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  inventory: Array<{
    productName: string;
    productType: string;
    quantity: number;
  }>;
  contactInfo: {
    email: string;
    phone: string;
  };
}

export interface DensityData {
  boundaryName: string;
  pointCount: number;
  boundaryCoordinates: number[][];
}

@Injectable({
  providedIn: 'root'
})
export class PointService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  importPoints(points: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/points/import`, points);
  }

  getAllPoints(): Observable<Point[]> {
    return this.http.get<Point[]>(`${this.apiUrl}/points`);
  }

  getDensity(): Observable<DensityData[]> {
    return this.http.get<DensityData[]>(`${this.apiUrl}/map/density`);
  }

  findClosestPoint(
    productName: string,
    productType: string,
    latitude: number,
    longitude: number
  ): Observable<Point & { distance: string }> {
    const params = new HttpParams()
      .set('productName', productName || '')
      .set('productType', productType || '')
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());

    return this.http.get<Point & { distance: string }>(`${this.apiUrl}/points/closest`, { params });
  }
}