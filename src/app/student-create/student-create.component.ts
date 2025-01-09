import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../Student';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { StudentService } from '../student.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit, AfterViewInit {
  student!:Student;
  profileForm!:FormGroup;
  browseFileMsg = 'No file selected'
  GENDERS = ['Male', 'Female']
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private location: Location
  ) { }

  setEmptyForm(){
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        this.ckInvalidname()
      ]),
      lastName: new FormControl('', [
        Validators.required,
        this.ckInvalidname()
      ]),
      gender: new FormControl('', [
        this.ckInvalidgender()
      ]),
      age: new FormControl('', [
        this.ckInvalidage()
      ]),
      profilePicture: new FormControl(null, Validators.required)
    })
  }

  setNonEmptyForm(){
    const base64String = this.student.profilePicture.replace("data:", "").replace(/^.+,/, "")
    const type = (this.student.profilePicture.split(';')[0]).split(':')[1];
    const imageContent = atob(base64String);
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);
    for (let n = 0; n < imageContent.length; n++) {
        view[n] = imageContent.charCodeAt(n);
    }
    const blob = new Blob([buffer], { type });
    let img = new File([blob], this.student.picName, { lastModified: new Date().getTime(), type })
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(img);

    this.profileForm = new FormGroup({
      firstName: new FormControl(this.student.firstName, [
        Validators.required,
        this.ckInvalidname()
      ]),
      lastName: new FormControl(this.student.lastName, [
        Validators.required,
        this.ckInvalidname()
      ]),
      gender: new FormControl(this.student.gender, [
        this.ckInvalidgender()
      ]),
      age: new FormControl(this.student.age, [
        this.ckInvalidage()
      ]),
      profilePicture: new FormControl(null, Validators.required)
    })
  }

  setInitialForm(){
    const id = this.route.snapshot.queryParams['id'];
    console.log(id)
    this.student = this.studentService.getStudent(id);
    if(id === undefined || id === null || this.student === undefined || this.student === null){
      this.setEmptyForm();
    } else if(this.student !== undefined && this.student !== null) {
      this.setNonEmptyForm();
    }
  }

  ngOnInit(): void {
    this.setInitialForm();
  }

  resetForm(){
    if(this.student !== undefined && this.student !== null){
      this.setNonEmptyForm();
    } else {
      this.setEmptyForm();
    }
    // this.browseFileMsg = (this.profileForm?.value?.profilePicture)?
    //                       this.profileForm.value.profilePicture[0].name:
    //                       'No file selected';
    // document.getElementById('ippic')?.setAttribute('title', this.browseFileMsg)
    // document.getElementById('ippic')?.setAttribute('value', '')
  }
  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get genderGtr() { return this.profileForm.get('gender'); }
  get ageGtr() { return this.profileForm.get('age'); }

  ngAfterViewInit(): void {
    if(this.profileForm?.value?.profilePicture!==null && this.profileForm?.value?.profilePicture!==undefined){
      // console.log(this.profileForm.value.profilePicture[0].name,'set title')
      // this.browseFileMsg = this.profileForm.value.profilePicture[0].name
      // setTimeout(() => this.browseFileMsg = this.profileForm.value.profilePicture[0].name, 0);
      // document.getElementById('ippic')?.setAttribute('title', this.profileForm.value.profilePicture[0].name)
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files; // Here we use only the first file (single file)
    console.log(file)
    if(file?.length!==0){
      this.profileForm.patchValue({ profilePicture: file});
      // this.browseFileMsg = this.profileForm.value.profilePicture[0].name
      // document.getElementById('ippic')?.setAttribute('title', this.profileForm.value.profilePicture[0].name)
    } else {
      this.profileForm.patchValue({ profilePicture: null});
      // this.browseFileMsg = 'No file selected'
      // document.getElementById('ippic')?.setAttribute('title', 'No file selected')
    }
  }

  onSubmit(){
    console.log(this.profileForm.value)
    console.log(this.profileForm.value.profilePicture)
    if(confirm((this.student)?"Are you sure you want to update the student?":"Are you sure you want to create a new student?")) {
      const update = (this.student!==null)&&(this.student!==undefined)
      const st = this.student;
      const pF = this.profileForm.value;
      let file = this.profileForm.value.profilePicture[0];
      let reader = new FileReader();
      const sv = this.studentService;
      reader.onload = function () {
        let dt = new Date().toJSON()
        if(update){
          sv.updateStudent(st.id, pF.firstName.trim(), pF.lastName.trim(), pF.gender.trim(), 
          pF.age, reader.result as string, file.name)
        }
        else {
          let nwSt = {} as Student;
          nwSt.firstName = pF.firstName.trim();
          nwSt.lastName = pF.lastName.trim();
          nwSt.gender = pF.gender.trim();
          nwSt.age = pF.age;
          nwSt.profilePicture = reader.result as string;
          nwSt.picName = file.name;
          nwSt.id = dt;
          sv.addStudent(nwSt);
        }
      }
      reader.readAsDataURL(file);
      this.location.back();
    }
  }

  // custom validator function to check string after trim,
  ckInvalidname(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = (control.value !== '') && (!(/[a-z0-9]/i.test(control.value?.trim())));
      return forbidden ? {invalidName: {value: control.value}} : null;
    };
  }

  ckInvalidgender(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = !((control.value.trim() === 'Male') || (control.value.trim() === 'Female'));
      return forbidden ? {invalidGender: {value: control.value}} : null;
    };
  }

  ckInvalidage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(typeof control.value === 'string' || control.value === null){
        return {invalidAge: {value: control.value}}
      }
      const forb = !(Number.isInteger(control.value));
      if(forb) {
        return {invalidAgeType: {value: control.value}};
      }
      const forbidden = !(control.value > 0 && control.value < 121);
      return forbidden ? {invalidAge: {value: control.value}} : null;
    };
  }
  putFocusOnBrowseField(){
    document.getElementById('ippic')?.focus();
  }
  putFocusOnGenderField(){
    document.getElementById('male')?.focus();
  }

}
