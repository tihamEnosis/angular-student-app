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
  defaultSort: SortDescriptor[] = [
    { field: 'id', dir: 'asc' }
  ];

  students: studentFromDB[] = [];
  searchTerm!: FormControl;

  constructor(
    private studentService: StudentService
  ) { }

  getStudents() {
    this.studentService.getAllStudentsFromDB().subscribe((students) => {
      this.students = students;
    })
  }

  ngOnInit(): void {
    this.searchTerm = new FormControl(this.studentService.getFilter);
    this.getStudents();
  }

  private searchTerms = new Subject<string>();

  onSearch(event: Event) {
    this.searchTerms.next(this.searchTerm.value);
  }

  searchTermsSubscription = this.searchTerms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
  ).subscribe(
    term => {
      this.studentService.setFilter = term;
      this.studentService.getAllStudentsFromDB().subscribe((students) => {
        this.students = students;
      })
    }
  )

  ngOnDestroy(): void {
    this.searchTermsSubscription.unsubscribe();
  }

}