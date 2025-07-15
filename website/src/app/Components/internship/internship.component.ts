import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TraineeDetailsService } from '../../Service/trainee-details.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-internship',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.css']
})
export class InternshipComponent {
  private formBuilder = inject(FormBuilder);
  private traineeDetailsService = inject(TraineeDetailsService);
  private router = inject(Router);

  TNData: any[] = [];
  checkTNData: any[] = [];
  checkboxIndex = 1;
  traineeDetail: any = {};

  crudEmployeeDetails: any[] = [];
  selectedFile: File | null = null;

  showMemberManagement = false;
  showUploadFile = false;
  showEditMember = false;
  showTraineeList = false;

  memberForm: FormGroup = this.formBuilder.group({
    ACE_ID: ['', Validators.required],
    First_Name: ['', Validators.required],
    Last_Name: ['', Validators.required],
    Designation: ['', Validators.required],
    Team: ['', Validators.required],
    Practice: ['', Validators.required]
  });

  uploadForm: FormGroup = this.formBuilder.group({
    fileUpload: ['', Validators.required]
  });

  KeywordForm: FormGroup = this.formBuilder.group({
    filterByKeyword: new FormControl('', Validators.required)
  });

  editMemberForm: FormGroup = this.formBuilder.group({
    ACE_ID: ['', Validators.required],
    First_Name: ['', Validators.required],
    Mail_ID: ['', Validators.required],
    College_Name: ['', Validators.required],
    Practice: ['', Validators.required],
    DOJ: ['', Validators.required]
  });

  filterByKeyword = '';
  filterByACEID = '';
  filterByFirstName = '';
  filterByLastName = '';
  filterByDesignation = '';
  filterByTeam = '';

  constructor() {
    this.retrieveImpactTraineeDetails();

    this.KeywordForm.valueChanges.subscribe(value => {
      this.filterData(value);
    });
  }

  retrieveImpactTraineeDetails(): void {
    this.traineeDetailsService.internshipDetails().subscribe(details => {
      this.TNData = details;
      this.checkTNData = [...this.TNData];
    });
  }

  showMember(): void {
    if (this.TNData.length > 0) {
      const employeeData = Object.keys(this.TNData[0]);
      this.crudEmployeeDetails = [];

      let iteratedCount = 2;
      while (iteratedCount < employeeData.length) {
        this.crudEmployeeDetails.push(employeeData.slice(iteratedCount, iteratedCount + 3));
        iteratedCount += 3;
      }
    }
    this.showMemberManagement = !this.showMemberManagement;
  }

  clearForm(): void {
    this.memberForm.reset();
    this.uploadForm.reset();
  }

  showFileUpload(): void {
    this.showUploadFile = !this.showUploadFile;
  }

  clickAllCheckBoxes(): void {
    for (let i = 0; i < this.TNData.length; i++) {
      const checkbox = document.getElementById(`checkbox${i}`) as HTMLInputElement | null;
      if (checkbox) {
        checkbox.checked = this.checkboxIndex === 1;
      }
    }
    this.checkboxIndex = this.checkboxIndex === 1 ? 2 : 1;
  }

  filterData(value: any): void {
    this.TNData = [...this.checkTNData];
    if (value.filterByKeyword && value.filterByKeyword.trim() !== '') {
      const filteredData = new Set<any>();
      for (const item of this.TNData) {
        const dataValues = Object.values(item);
        for (const val of dataValues) {
          if (String(val).toLowerCase().includes(value.filterByKeyword.toLowerCase())) {
            filteredData.add(item);
            break;
          }
        }
      }
      this.TNData = filteredData.size > 0 ? Array.from(filteredData) : [];
    }
  }

  addMember(value: any): void {
    this.TNData.push(value);
    alert(`Successfully Added ${value.Name}`);
    this.showMember();
  }

  deleteMember(index: number): void {
    if (confirm(`Sure you want to Remove ${this.TNData[index].Name}?`)) {
      this.traineeDetailsService.deleteInternship(this.TNData[index]);
      this.TNData.splice(index, 1);
      this.checkTNData = [...this.TNData];
    }
  }

  showEdit(): void {
    this.showEditMember = !this.showEditMember;
  }

  editMember(index: number): void {
    this.showEdit();
    const member = this.TNData[index];
    this.editMemberForm.setValue({
      ACE_ID: member.INT_ID || '',
      First_Name: member.Name || '',
      Mail_ID: member.Mail_Id || '',
      College_Name: member.College || '',
      Practice: member.Practice || '',
      DOJ: member.Date_of_Joining || ''
    });
  }

  EditedMemberDetails(value: any): void {
    const index = this.TNData.findIndex(item => item.ACE_ID === value.ACE_ID);
    if (index !== -1) {
      this.TNData[index] = value;
    }
    this.showEdit();
  }

  deleteAllMembers(): void {
    const parentCheckbox = document.getElementById('parentCheckBox') as HTMLInputElement | null;
    if (!parentCheckbox) return;

    if (parentCheckbox.checked) {
      if (confirm('Sure you want to remove all Members?')) {
        this.traineeDetailsService.deleteAllInternship();
        this.TNData = [];
        this.checkTNData = [];
        parentCheckbox.checked = false;
      }
    } else {
      let checkedIndex = 0;
      for (let i = 0; i < this.TNData.length; i++) {
        const checkbox = document.getElementById(`checkbox${i}`) as HTMLInputElement | null;
        if (checkbox && checkbox.checked) {
          this.deleteMember(i);
          checkedIndex++;
          checkbox.checked = false;
        }
      }
      if (checkedIndex === 0) {
        alert('Select the Members to remove');
      }
    }
  }

  showTraineeDetails(index: number): void {
    if (index >= 0) {
      this.traineeDetail = this.TNData[index];
    }
    this.showTraineeList = !this.showTraineeList;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.traineeDetailsService.internshipSendExcelFile(this.selectedFile);
    } else {
      alert('Please select a file before uploading.');
    }
  }
}