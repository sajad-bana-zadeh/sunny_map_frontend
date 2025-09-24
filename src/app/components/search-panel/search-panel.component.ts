import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
