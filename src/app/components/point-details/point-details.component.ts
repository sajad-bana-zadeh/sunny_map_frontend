import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Point } from '../../services/point.service';

@Component({
  selector: 'app-point-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.css']
})
export class PointDetailsComponent {
  @Input() point: (Point & { distance: string }) | null = null;
  isExpanded: boolean = false;

  togglePanel(): void {
    this.isExpanded = !this.isExpanded;
  }
}
