import { Injectable } from '@angular/core';
import { studentFromDB, customHttpResponse } from './Student';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private filter = '';
  public get getFilter() {
    return this.filter;
  }
  public set setFilter(val: string) {
    this.filter = val
  }

  createStudentInDB(formData: FormData): Observable<customHttpResponse> {
    return this.http.post<customHttpResponse>('http://localhost:8080/create', formData)
      .pipe(
        catchError((e) => {
          return of({ status: e.status, message: e.error } as customHttpResponse)
        })
      )
  }

  updateStudentInDB(formData: FormData, id: string): Observable<customHttpResponse> {
    return this.http.put<customHttpResponse>('http://localhost:8080/update/' + id, formData)
      .pipe(
        catchError((e) => {
          return of({ status: e.status, message: e.error } as customHttpResponse)
        })
      )
  }

  getAllStudentsFromDB(): Observable<studentFromDB[]> {
    var searchParam = (this.filter === '') ? '' : `searchTerm=${this.filter}`;
    var sortBy = "", sortDirection = "";
    var sortParam = '';
    if (sortBy !== '') sortParam = "sortBy=" + `${sortBy}` + "&sortDirection=" + `${sortDirection}`

    var finalParam = '';
    if (searchParam !== '' && sortParam !== '') finalParam = "?" + searchParam + "&" + sortParam;
    else if (searchParam !== '' && sortParam === '') finalParam = "?" + searchParam;
    else if (searchParam === '' && sortParam !== '') finalParam = "?" + sortParam;

    return this.http.get<studentFromDB[]>('http://localhost:8080/retrieve' + finalParam)
      .pipe(
        catchError((e) => {
          return of([] as studentFromDB[])
        })
      )
  }

  getSpecificStudentFromDB(id: string): Observable<studentFromDB> {
    if (!id) {
      return of(undefined as unknown as (studentFromDB))
    } else {
      return this.http.get<studentFromDB>('http://localhost:8080/specificRetrieve/' + id)
        .pipe(
          catchError((e) => {
            return of(undefined as unknown as (studentFromDB))
          })
        )
    }
  }

  deleteStudentFromDB(id: string): Observable<customHttpResponse> {
    return this.http.delete<customHttpResponse>('http://localhost:8080/delete/' + id)
      .pipe(
        catchError((e) => {
          return of({ status: e.status, message: e.error } as customHttpResponse)
        })
      )
  }

  constructor(private http: HttpClient) { }
}
