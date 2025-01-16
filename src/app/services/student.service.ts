import { Injectable } from '@angular/core';
import { studentFromDB, deleteHttpResponse } from './Student';
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

  createStudentInDB(formData: FormData): Observable<deleteHttpResponse> {
    return this.http.post<deleteHttpResponse>('http://localhost:8080/create', formData)
      .pipe(
        catchError((e) => {
          return of({ status: e.status, message: e.error } as deleteHttpResponse)
        })
      )
  }

  updateStudentInDB(formData: FormData, id: string): Observable<deleteHttpResponse> {
    return this.http.put<deleteHttpResponse>('http://localhost:8080/update/' + id, formData)
      .pipe(
        catchError((e) => {
          return of({ status: e.status, message: e.error } as deleteHttpResponse)
        })
      )
  }

  getStudentsObservableFromDB(): Observable<studentFromDB[]> {
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

  delStudentFromDB(id: string): Observable<deleteHttpResponse> {
    return this.http.delete<deleteHttpResponse>('http://localhost:8080/delete/' + id)
      .pipe(
        catchError((e) => {
          return of({ status: e.status, message: e.error } as deleteHttpResponse)
        })
      )
  }

  constructor(private http: HttpClient,) { }
}
