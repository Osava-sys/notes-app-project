import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circular-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="circular-progress" [style.--progress]="progressPercent" [style.--color]="color">
      <svg viewBox="0 0 100 100">
        <circle class="bg" cx="50" cy="50" r="45"/>
        <circle class="fill" cx="50" cy="50" r="45"/>
      </svg>
      <span class="value">{{ value }}</span>
    </div>
  `,
  styles: [`
    .circular-progress {
      position: relative;
      width: 120px;
      height: 120px;
    }
    .circular-progress svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }
    .circular-progress .bg {
      fill: none;
      stroke: rgba(0,0,0,0.08);
      stroke-width: 8;
    }
    .circular-progress .fill {
      fill: none;
      stroke: var(--color, #4f46e5);
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: 283;
      stroke-dashoffset: calc(283 - (283 * var(--progress, 0)) / 100);
      transition: stroke-dashoffset 0.8s ease;
    }
    .circular-progress .value {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 800;
    }
  `],
})
export class CircularProgressComponent {
  @Input() value = 0;
  @Input() max = 20;
  @Input() color = '#4f46e5';

  get progressPercent(): number {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }
}
