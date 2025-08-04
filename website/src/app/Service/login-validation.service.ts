import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginValidationService {

  private http = inject(HttpClient);
  private router = inject(Router);
  employeeDetails: any;

  loginValidation(value: any) {
    this.http.get<any>(environment.TNDetails).subscribe(details => {
      const validation = (details as any[]).find((employee: any) => {
        this.employeeDetails = employee;
        return value.EmployeeEmail === employee.MAIL_ID && value.EmployeePassword === employee.PASSWORD;
      });

      if (validation) {
        alert("Successfully LoggedIn");
        sessionStorage.setItem("Employee_Name", this.employeeDetails.FIRST_NAME + " " + this.employeeDetails.LAST_NAME);
        sessionStorage.setItem("Employee_Designation", this.employeeDetails.DESIGNATION);
        sessionStorage.setItem("Employee_Email", this.employeeDetails.MAIL_ID);
        this.router.navigateByUrl("homePage");
      } else {
        alert("Invalid Credentials");
      }
    }, error => {
      alert('Error fetching employee details.');
    });
  }

}
