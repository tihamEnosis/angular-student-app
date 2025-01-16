import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { studentFromDB } from '../../services/Student';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Location } from '@angular/common';
import { map } from 'rxjs';
import { FileRestrictions } from '@progress/kendo-angular-upload';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {
  student!: studentFromDB;
  profileForm!: FormGroup;
  fileRestrictions: FileRestrictions = {
    allowedExtensions: [".jpg", ".png", ".jpeg", ".avif"],
  };

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private location: Location
  ) { }

  setEmptyForm() {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        this.nameValidityCheck()
      ]),
      lastName: new FormControl('', [
        Validators.required,
        this.nameValidityCheck()
      ]),
      gender: new FormControl('', [
        this.genderValidityCheck()
      ]),
      age: new FormControl('', [
        this.ageValidityCheck()
      ]),
      profilePicture: new FormControl(null, Validators.required)
    })
  }

  setNonEmptyForm() {
    this.profileForm = new FormGroup({
      firstName: new FormControl(this.student.firstName, [
        Validators.required,
        this.nameValidityCheck()
      ]),
      lastName: new FormControl(this.student.lastName, [
        Validators.required,
        this.nameValidityCheck()
      ]),
      gender: new FormControl(this.student.gender, [
        this.genderValidityCheck()
      ]),
      age: new FormControl(this.student.age, [
        this.ageValidityCheck()
      ]),
      profilePicture: new FormControl(null, Validators.required)
    })
  }

  setInitialForm() {
    this.route.data.pipe(
      map(data => data?.['fetchedStudent'])
    ).subscribe((student) => {
      this.student = student as studentFromDB
      if (this.student) {
        this.setNonEmptyForm();
      }
      else {
        this.setEmptyForm();
      }
    })
  }

  ngOnInit(): void {
    this.setEmptyForm();
    this.setInitialForm();
  }

  get firstNameFormControlGetter() {
    return this.profileForm.get('firstName');
  }
  get lastNameFormControlGetter() {
    return this.profileForm.get('lastName');
  }
  get genderFormControlGetter() {
    return this.profileForm.get('gender');
  }
  get ageFormControlGetter() {
    return this.profileForm.get('age');
  }

  onSubmit() {
    if (confirm((this.student) ? "Are you sure you want to update the student?" : "Are you sure you want to create a new student?")) {
      const update = (this.student !== null) && (this.student !== undefined);

      const pF = this.profileForm.value;
      const formData = new FormData();

      formData.append('firstName', pF.firstName.trim());
      formData.append('lastName', pF.lastName.trim());
      formData.append('age', pF.age as string);
      formData.append('gender', pF.gender.trim());
      formData.append('profilePicture', pF.profilePicture[0]);

      if (update) {
        this.studentService.updateStudentInDB(formData, this.student.id.toString()).subscribe(
          (updateResult) => {
            if (updateResult.status === 200) {
              this.location.back();
            } else {
              alert(updateResult.message);
            }
          }
        )
      }

      else {
        this.studentService.createStudentInDB(formData).subscribe(
          (createResult) => {
            if (createResult.status === 200) {
              this.location.back();
            } else {
              alert(createResult.message);
            }
          }
        )
      }
    }
  }

  nameValidityCheck(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = (control.value !== '') && (!(/^[A-Za-z0-9]+$/i.test(control.value?.trim())));
      return forbidden ? { invalidName: { value: control.value } } : null;
    };
  }

  genderValidityCheck(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(!control.value){
        return { genderRequiredError: { value: 'age required' } };
      }
      const forbidden = !((control.value?.trim() === 'Male') || (control.value?.trim() === 'Female'));
      return forbidden ? { invalidGender: { value: control.value } } : null;
    };
  }

  ageValidityCheck(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { ageRequiredError: { value: 'age required' } };
      }
      if (!(Number.isInteger(control.value))) {
        return { invalidAgeType: { value: control.value } };
      }
      const forbidden = !(control.value && control.value > 0 && control.value < 121);
      return forbidden ? { invalidAge: { value: control.value } } : null;
    };
  }

  putFocusOnBrowseField() {
    let d = document.getElementById('pictureSelector')?.childNodes[1].firstChild?.firstChild as HTMLElement;
    d.focus();
    setTimeout(() => {
      document.getElementById('pictureSelector')?.classList.remove('ng-invalid');
      document.getElementById('pictureSelector')?.classList.remove('ng-touched');
      document.getElementById('pictureBrowserContainer')?.classList.remove('k-form-field-error');
      document.getElementById('pictureSelector')?.classList.add('ng-untouched');
    }, 0);
  }

  putFocusOnGenderField() {
    document.getElementById('maleGenderInputField')?.focus();
  }
}
