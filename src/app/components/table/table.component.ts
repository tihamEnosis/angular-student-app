import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { studentFromDB } from '../../services/Student';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit, OnDestroy {
  public defaultSort: SortDescriptor[] = [
    { field: 'id', dir: 'asc' }
  ];

  students: studentFromDB[] = [];
  srcName!:FormControl;

  constructor(
    private studentService: StudentService
  ) { }

  getStudents(){
    this.studentService.getStudentsObservableFromDB().subscribe((x)=>{
      this.students = x;
    })
  }

  ngOnInit(): void {
    this.srcName = new FormControl(this.studentService.getFilter);
    this.getStudents();
  }

  private searchTerms = new Subject<string>();

  onSrc(event:Event){
    this.searchTerms.next(this.srcName.value);
  }

  sub = this.searchTerms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
  ).subscribe(
    trm => {
      this.studentService.setFilter = trm;
      this.studentService.getStudentsObservableFromDB().subscribe((x)=>{
        this.students = x;
      })
    }
  )

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}