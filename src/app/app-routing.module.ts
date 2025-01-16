import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { StudentCreateComponent } from './components/student-create/student-create.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { StudentDetailsResolver } from './services/student-details-resolver.service';

const routes: Routes = [
  { path: 'list', component: TableComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  {
    path: 'detail/:Id', component: StudentDetailComponent, resolve: {
      fetchedStudent: StudentDetailsResolver
    }
  },
  {
    path: 'create', component: StudentCreateComponent, resolve: {
      fetchedStudent: StudentDetailsResolver
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
