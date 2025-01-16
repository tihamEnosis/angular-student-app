import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { StudentService } from './student.service';
import { deleteHttpResponse, studentFromDB } from './Student';

@Injectable({
    providedIn: "root",
})

export class StudentDetailsResolver implements Resolve<studentFromDB> {
    constructor(private studentService: StudentService, private router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Observable<studentFromDB> {
        return this.studentService.getSpecificStudentFromDB(route.paramMap.get('Id') || route.queryParams['id']);
    }
}