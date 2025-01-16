import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app-component/app.component';
import { TableComponent } from './components/table/table.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { StudentCreateComponent } from './components/student-create/student-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { InputsModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from "@progress/kendo-angular-label";
import { UploadsModule } from "@progress/kendo-angular-upload";
import { GridModule } from "@progress/kendo-angular-grid";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    StudentDetailComponent,
    StudentCreateComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    ButtonsModule,
    LabelModule,
    InputsModule,
    UploadsModule,
    GridModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
