import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { LoginValidationService } from '../../Service/login-validation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[CommonModule,FormsModule,ReactiveFormsModule]

})
export class LoginComponent {
  loginForm:FormGroup;
  passwordType = "password";
  isToggleEyeIcon = false;
  isEmailValid = true;
  

  // this constructor is used validate the Login Form
  constructor(private fb:FormBuilder,private router:Router,private http:HttpClient, private loginService: LoginValidationService) {
    this.loginForm = this.fb.group({
      EmployeeEmail : ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]{5,}@(aspiresys)\.com$')]],
      EmployeePassword : ['',[Validators.required,Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]]
    })
   }

   
   // this function is used to toggle the password type
   togglePassword(){
    if(this.passwordType == "password"){
      this.passwordType = "text";
      this.isToggleEyeIcon = true;
    }else{
      this.passwordType = "password";
      this.isToggleEyeIcon = false;
    }
   }

   // this function is used to route to Home page
   routeToDashboard(value:any){
    this.loginService.loginValidation(value);
   }
}
