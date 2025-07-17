import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TraineeDetailsService } from '../../Service/trainee-details.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-trainee',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './review-trainee.component.html',
  styleUrls: ['./review-trainee.component.css']
})
export class ReviewTraineeComponent {
  private formBuilder = inject(FormBuilder);
  private traineeDetailsService = inject(TraineeDetailsService);
  private router = inject(Router);

  TNData: any[] = [];
  checkTNData: any[] = [];
  checkboxIndex = 1;
  traineeDetail: any = {};

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
    this.retrieveReviewDetails();

    this.KeywordForm.valueChanges.subscribe(value => {
      this.filterData(value);
    });
  }

  retrieveReviewDetails(): void {
    this.traineeDetailsService.reviewDetails().subscribe(details => {
      this.TNData = details;
      this.checkTNData = [...this.TNData];
    });
  }

  clearForm(): void {
    this.memberForm.reset();
    this.editMemberForm.reset();
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

  deleteMember(index: number): void {
    if (confirm(`Are you sure you want to remove ${this.TNData[index].NAME}?`)) {
      this.traineeDetailsService.deleteReviewDetails(this.TNData[index]);
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
      ACE_ID: member.ACE_ID || '',
      First_Name: member.First_Name || '',
      Mail_ID: member.Mail_ID || '',
      College_Name: member.College_Name || '',
      Practice: member.Practice || '',
      DOJ: member.DOJ || ''
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
      if (confirm('Are you sure you want to remove all Members?')) {
        this.traineeDetailsService.deleteAllReviewDetails();
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
      this.traineeDetailsService.reviewDetailsSendExcelFile(this.selectedFile);
    } else {
      alert('Please select a file before uploading.');
    }
  }

  downloadTable() {
  this.traineeDetailsService.downloadExcel().subscribe((blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'excel-data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }, error => {
    console.error('Download error:', error);
  });
}


}