import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Student } from '../Student';

@Component({
  selector: '[app-table-row]',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css']
})
export class TableRowComponent implements OnInit, OnChanges {
  @Input() student!: Student;
  @Input() i!:number;

  st!: Student;
  constructor() { }

  ngOnInit(): void {
    console.log(this.i, this.student)
  }
  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
