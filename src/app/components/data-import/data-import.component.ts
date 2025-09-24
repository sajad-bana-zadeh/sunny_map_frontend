import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointService } from '../../services/point.service';

@Component({
  selector: 'app-data-import',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="import-panel">
      <h5>Import Test Data</h5>
      <button class="btn btn-success" (click)="importSampleData()">
        Import Sample Points
      </button>
      <div *ngIf="importStatus" class="status-message" [class.success]="importSuccess">
        {{ importStatus }}
      </div>
    </div>
  `,
  styles: [`
    .import-panel {
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
    }
    .status-message {
      margin-top: 10px;
      padding: 10px;
      border-radius: 4px;
      background: #f8d7da;
      color: #721c24;
    }
    .status-message.success {
      background: #d4edda;
      color: #155724;
    }
  `]
})
export class DataImportComponent {
  importStatus: string = '';
  importSuccess: boolean = false;

  sampleData = [
    {
      name: "Manhattan Electronics Store",
      location: { latitude: 40.7614, longitude: -73.9776 },
      inventory: [
        { productName: "MacBook Pro", productType: "Electronics", quantity: 12 },
        { productName: "iPhone 15", productType: "Electronics", quantity: 25 },
        { productName: "AirPods Pro", productType: "Electronics", quantity: 50 }
      ],
      contactInfo: { email: "manhattan@techstore.com", phone: "+1-212-555-0101" }
    },
    {
      name: "Brooklyn Furniture Warehouse",
      location: { latitude: 40.6782, longitude: -73.9442 },
      inventory: [
        { productName: "Office Chair Pro", productType: "Furniture", quantity: 30 },
        { productName: "Standing Desk", productType: "Furniture", quantity: 15 },
        { productName: "Bookshelf Unit", productType: "Furniture", quantity: 20 }
      ],
      contactInfo: { email: "brooklyn@furniture.com", phone: "+1-718-555-0102" }
    },
    {
      name: "Queens Tech Hub",
      location: { latitude: 40.7282, longitude: -73.7949 },
      inventory: [
        { productName: "Gaming Laptop", productType: "Electronics", quantity: 8 },
        { productName: "Wireless Mouse", productType: "Electronics", quantity: 45 },
        { productName: "USB-C Hub", productType: "Electronics", quantity: 60 }
      ],
      contactInfo: { email: "queens@techhub.com", phone: "+1-718-555-0103" }
    },
    {
      name: "Bronx Appliance Center",
      location: { latitude: 40.8448, longitude: -73.8648 },
      inventory: [
        { productName: "Microwave", productType: "Appliances", quantity: 20 },
        { productName: "Coffee Maker", productType: "Appliances", quantity: 35 },
        { productName: "Air Fryer", productType: "Appliances", quantity: 15 }
      ],
      contactInfo: { email: "bronx@appliances.com", phone: "+1-718-555-0104" }
    },
    {
      name: "Staten Island Office Supplies",
      location: { latitude: 40.5795, longitude: -74.1502 },
      inventory: [
        { productName: "Printer", productType: "Electronics", quantity: 10 },
        { productName: "Office Chair", productType: "Furniture", quantity: 25 },
        { productName: "Desk Lamp", productType: "Furniture", quantity: 40 }
      ],
      contactInfo: { email: "si@officesupplies.com", phone: "+1-718-555-0105" }
    }
  ];

  constructor(private pointService: PointService) {}

  importSampleData(): void {
    this.pointService.importPoints(this.sampleData).subscribe(
      response => {
        this.importStatus = `Successfully imported ${response.imported} points!`;
        this.importSuccess = true;
        setTimeout(() => window.location.reload(), 2000);
      },
      error => {
        this.importStatus = 'Failed to import data. Please try again.';
        this.importSuccess = false;
      }
    );
  }
}
