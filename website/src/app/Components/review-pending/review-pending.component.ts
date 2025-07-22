import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TraineeDetailsService } from '../../Service/trainee-details.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-pending',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './review-pending.component.html',
  styleUrls: ['./review-pending.component.css']
})
export class ReviewPendingComponent {
  private formBuilder = inject(FormBuilder);
  private traineeDetailsService = inject(TraineeDetailsService);
  private router = inject(Router);

  reviewDetails: any[] = [];
  checkreviewDetails: any[] = [];
  checkboxIndex = 1;
  traineeDetail: any = {};
  filteredQuestionBank: any[] = [];
  questionBank: any[] = [];
  impactTraineeDetails: any[] = [];
  internshipDetails: any[] = [];
  TNTeamDetails: any[] = [];
  employeeDetails: any[] = [];

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
      this.reviewDetails = details.filter((item: any) => !item.MARKS_LIST);
      this.checkreviewDetails = [...this.reviewDetails];
    });

    this.traineeDetailsService.getQuestionBank().subscribe(details => {
      this.questionBank = details;
    });

    this.traineeDetailsService.impactTraineeDetails().subscribe(details => {
      this.impactTraineeDetails = details;
      this.employeeDetails.push(...this.impactTraineeDetails);
    });

    this.traineeDetailsService.internshipDetails().subscribe(details => {
      this.internshipDetails = details;
      this.employeeDetails.push(...this.internshipDetails);
    });

    this.traineeDetailsService.TNDetails().subscribe(details => {
      this.TNTeamDetails = details;
      this.employeeDetails.push(...this.TNTeamDetails);
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
    for (let i = 0; i < this.reviewDetails.length; i++) {
      const checkbox = document.getElementById(`checkbox${i}`) as HTMLInputElement | null;
      if (checkbox) {
        checkbox.checked = this.checkboxIndex === 1;
      }
    }
    this.checkboxIndex = this.checkboxIndex === 1 ? 2 : 1;
  }

  filterData(value: any): void {
    this.reviewDetails = [...this.checkreviewDetails];
    if (value.filterByKeyword && value.filterByKeyword.trim() !== '') {
      const filteredData = new Set<any>();
      for (const item of this.reviewDetails) {
        const dataValues = Object.values(item);
        for (const val of dataValues) {
          if (String(val).toLowerCase().includes(value.filterByKeyword.toLowerCase())) {
            filteredData.add(item);
            break;
          }
        }
      }
      this.reviewDetails = filteredData.size > 0 ? Array.from(filteredData) : [];
    }
  }

  deleteMember(index: number): void {
    if (confirm(`Are you sure you want to remove ${this.reviewDetails[index].NAME}?`)) {
      this.traineeDetailsService.deleteReviewDetails(this.reviewDetails[index]);
      this.reviewDetails.splice(index, 1);
      this.checkreviewDetails = [...this.reviewDetails];
    }
  }

  showEdit(): void {
    this.showEditMember = !this.showEditMember;
  }

  editMember(index: number): void {
    this.showEdit();
    const member = this.reviewDetails[index];
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
    const index = this.reviewDetails.findIndex(item => item.ACE_ID === value.ACE_ID);
    if (index !== -1) {
      this.reviewDetails[index] = value;
    }
    this.showEdit();
  }

  // To delete All the members
  deleteAllMembers(): void {
    const parentCheckbox = document.getElementById('parentCheckBox') as HTMLInputElement | null;
    console.log("Deleting all members!")
    if (!parentCheckbox) return;

    if (parentCheckbox.checked) {
      if (confirm('Are you sure you want to remove all Members?')) {
        this.traineeDetailsService.deleteAllReviewDetails();
        this.reviewDetails = [];
        this.checkreviewDetails = [];
        parentCheckbox.checked = false;
      }
    } else {
      let checkedIndex = 0;
      for (let i = 0; i < this.reviewDetails.length; i++) {
        const checkbox = document.getElementById('checkbox' + i) as HTMLInputElement | null;
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
  if (this.selectedFile) {
    this.traineeDetailsService.reviewDetailsSendExcelFile(this.selectedFile).subscribe({
      next: (res) => {
        alert('File uploaded successfully.');
        this.clearForm();       // Optional: resets form and file
        this.showFileUpload();  // Optional: closes the modal
      },
      error: (err) => {
        alert('Failed to upload file.');
        console.error(err);
      }
    });
  } else {
    alert('Please select a file before uploading.');
  }
}


  showTraineeDetails(index: number): void {
    this.filteredQuestionBank = [];
    if (index >= 0) {
      this.traineeDetail = this.reviewDetails[index];
      for (const question of this.questionBank) {
        if (question.TECHNOLOGY_NAME === 'Soft Skills') {
          this.filteredQuestionBank.push(question);
        }
      }
      for (const question of this.questionBank) {
        if (question.TECHNOLOGY_NAME.toLowerCase() === this.traineeDetail.TECHNOLOGY.toLowerCase()) {
          this.filteredQuestionBank.push(question);
        }
      }
    }
    this.showTraineeList = !this.showTraineeList;
  }

  saveScore(): void {
    const MarksList: number[] = [];
    let sumMarks = 0;
    let weightageSum = 0;

    for (let i = 0; i < this.filteredQuestionBank.length; i++) {
      const marksInput = document.getElementById(`score${i}`) as HTMLInputElement | null;
      const marksValue = marksInput?.value ?? '0';
      const marks = Number(marksValue);
      MarksList[i] = marks;
      sumMarks += marks;
      weightageSum += this.filteredQuestionBank[i].WEIGHTAGE;
    }

    let overallPerformance = '';
    sumMarks = (sumMarks / weightageSum) * 100;

    if (sumMarks >= 95) overallPerformance = 'Exceptional';
    else if (sumMarks >= 85) overallPerformance = 'Excellent';
    else if (sumMarks >= 70) overallPerformance = 'Good';
    else if (sumMarks >= 60) overallPerformance = 'Average';
    else {
      overallPerformance = 'Needs Improvement';

      const emailCCList: string[] = [];
      let emailTo = '';

      for (const employee of this.employeeDetails) {
        if (
          employee.ACE_ID === this.traineeDetail.MENTOR_ID ||
          employee.ACE_ID === this.traineeDetail.REVIEWER_ID ||
          employee.ACE_ID === this.traineeDetail.TN_TEAM_ID
        ) {
          emailCCList.push(employee.Mail_Id);
        } else if (
          employee.ACE_ID === this.traineeDetail.TRAINEE_ID ||
          employee.INT_ID === this.traineeDetail.TRAINEE_ID
        ) {
          emailTo = employee.Mail_Id;
        }
      }

      const aiSuggestionList = this.filteredQuestionBank.map((question, i) => ({
        Technical_Topic: question.TOPIC,
        Objective: question.OBJECTIVE,
        Maximum: question.WEIGHTAGE,
        Awarded: MarksList[i]
      }));

      // Uncomment if AI suggestion service is implemented
      // this.traineeDetailsService.aiSuggestion(aiSuggestionList);

      this.traineeDetailsService.sendSuggestionMail(emailCCList, emailTo);
    }

    const finalUpdate = {
      ...this.traineeDetail,
      OVERALL_SCORE: sumMarks,
      OVERALL_PERFORMANCE: overallPerformance,
      MARKS_LIST: MarksList
    };

    this.traineeDetailsService.updateMarks(finalUpdate).subscribe({
      next: () => {
        alert('Marks updated');
        window.location.reload();
      },
      error: (error) => {
        console.error(error);
      }
    });
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