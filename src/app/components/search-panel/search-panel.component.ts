import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent {
  @Output() search = new EventEmitter<{ productName: string; productType: string }>();

  productName: string = '';
  productType: string = '';
  isExpanded: boolean = false;

  onSearch(): void {
    this.search.emit({
      productName: this.productName,
      productType: this.productType
    });
  }

  togglePanel(): void {
    this.isExpanded = !this.isExpanded;
  }

  clearSearch(): void {
    this.productName = '';
    this.productType = '';
  }
}