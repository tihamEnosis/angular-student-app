import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { StudentService } from '../student.service';
import { Student } from '../Student';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student!:Student;
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getStudent();
  }
  getStudent(){
    const id = this.route.snapshot.paramMap.get('Id');
    this.student = this.studentService.getStudent(id);
    console.log(this.student)
  }
  goBack(): void {
    this.location.back();
  }
  deleteStudent(id:string){
    this.studentService.deleteStudent(id)
    this.goBack()
  }

}
