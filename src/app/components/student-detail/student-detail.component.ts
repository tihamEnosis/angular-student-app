import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { studentFromDB } from '../../services/Student';
import { map } from 'rxjs';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student!: studentFromDB;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getStudent();
  }

  getStudent() {
    this.route.data.pipe(
      map(data => data?.['fetchedStudent'])
    ).subscribe((student) => {
      this.student = student as studentFromDB;
    })
  }

  goBack(): void {
    this.location.back();
  }

  deleteStudent(id: string) {
    this.studentService.deleteStudentFromDB(id).subscribe(
      (deleteResult) => {
        if (deleteResult.status === 200) {
          this.goBack();
        } else {
          alert(deleteResult.message);
        }
      }
    )
  }

}
