import { Component, Input } from '@angular/core';

@Component({
  selector: 'checked-svg-component',
  templateUrl: './svg.component.svg',
  styleUrls: ['./svg.component.css'],
})
export class CheckedSvgComponent {
  @Input() color!:string;
  @Input() width!:string;
  @Input() height!:string;

}
