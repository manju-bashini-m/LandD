import { Component } from '@angular/core';
import { TraineeDetailsService } from '../../Service/trainee-details.service';
import {
  CommonModule
} from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-question-bank',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.css'
})
export class QuestionBankComponent {
  // Your existing arrays and flags
  reviewDetails: any[] = [];
  checkreviewDetails: any[] = [];
  questionBank: any[] = [];
  editedIndex: number | null = null;

  technologyList: Set<string> = new Set();
  impactTraineeList: any[] = [];
  internList: any[] = [];
  employeeList: any[] = [];

  showAddQuestion = false;
  showEditMember = false;
  showTraineeList = false;

  checkboxIndex = 1;

  questionForm: FormGroup;
  uploadForm: FormGroup;       // existing reviewDetails upload form
  KeywordForm: FormGroup;
  editQuestionForm: FormGroup;
  qBankUploadForm!: FormGroup;
  // New for question bank Excel upload modal
  showUploadQnBankFile = false;
  selectedQBankFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private traineeDetailsService: TraineeDetailsService
  ) {
    // Existing form initializations
    this.KeywordForm = this.formBuilder.group({
      filterByKeyword: new FormControl('', Validators.required),
    });

    this.questionForm = this.formBuilder.group({
      TECHNOLOGY_NAME: ['', Validators.required],
      TOPIC: ['', Validators.required],
      OBJECTIVE: ['', Validators.required],
      WEIGHTAGE: ['', Validators.required],
    });

    this.editQuestionForm = this.formBuilder.group({
      TECHNOLOGY_NAME: ['', Validators.required],
      TOPIC: ['', Validators.required],
      OBJECTIVE: ['', Validators.required],
      WEIGHTAGE: ['', Validators.required],
    });

    this.uploadForm = this.formBuilder.group({
      fileUpload: ['', Validators.required],
    });
    this.qBankUploadForm = this.formBuilder.group({});


    this.retrieveReviewDetails();

    this.KeywordForm.valueChanges.subscribe((value) => {
      this.filterData(value);
    });
  }

  get technologyArray() {
    return Array.from(this.technologyList);
  }

  retrieveReviewDetails() {
    forkJoin([
      this.traineeDetailsService.reviewDetails(),
      this.traineeDetailsService.impactTraineeDetails(),
      this.traineeDetailsService.internshipDetails(),
      this.traineeDetailsService.getQuestionBank()
    ]).subscribe(([review, impacts, interns, questions]) => {
      this.reviewDetails = review;
      this.impactTraineeList = impacts;
      this.internList = interns;
      this.questionBank = questions;
      this.checkreviewDetails = [...questions];
      this.allTechList(); // Build list AFTER all data is loaded
    });
  }

  allTechList() {
    this.employeeList = [...this.impactTraineeList, ...this.internList];
    this.technologyList.clear();
    for (const emp of this.employeeList) {
      if (emp?.Practice) this.technologyList.add(emp.Practice);
    }
  }

  clickAllCheckBoxes() {
    for (let i = 0; i < this.reviewDetails.length; i++) {
      const checkbox = document.getElementById('checkbox' + i) as HTMLInputElement | null;
      if (checkbox) checkbox.checked = this.checkboxIndex === 1;
    }
    this.checkboxIndex = this.checkboxIndex === 1 ? 2 : 1;
  }

  filterData(value: any) {
    this.questionBank = [...this.checkreviewDetails];
    if (value.filterByKeyword && value.filterByKeyword.trim() !== '') {
      const keyword = value.filterByKeyword.trim().toLowerCase();
      const filtered = this.questionBank.filter((q) =>
        Object.values(q).some((val) => String(val).toLowerCase().includes(keyword))
      );
      this.questionBank = filtered;
    }
  }

  deleteQuestion(index: number): void {
    const question = this.questionBank[index];
    if (confirm(`Are you sure you want to remove ${question.TECHNOLOGY_NAME}?`)) {
      this.traineeDetailsService.deleteQuestion(question).subscribe({
        next: () => {
          this.questionBank.splice(index, 1);
          this.checkreviewDetails = this.questionBank.slice();
        },
        error: (err) => {
          console.error('Failed to delete question:', err);
        }
      });
    }
  }

  showEdit() {
    this.showEditMember = !this.showEditMember;
    if (this.showEditMember) this.allTechList();
  }

  showEditQuestion(index: number) {
    this.showEdit();
    const q = this.questionBank[index];
    this.editQuestionForm.patchValue({
      TOPIC: q.TOPIC,
      OBJECTIVE: q.OBJECTIVE,
      WEIGHTAGE: q.WEIGHTAGE,
      TECHNOLOGY_NAME: q.TECHNOLOGY_NAME,
    });
    this.editedIndex = index;
  }

  showQuestion() {
    this.showAddQuestion = !this.showAddQuestion;
    if (this.showAddQuestion) this.allTechList();
  }

  // Existing selectedFile and onFileChange for reviewDetails upload
  selectedFile: File | null = null;
  onQBankFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedQBankFile = input.files[0];
  }
}




  // For Review Details upload (existing)
  uploadFile(): void {
    if (this.selectedFile) {
      this.traineeDetailsService.reviewDetailsSendExcelFile(this.selectedFile).subscribe({
        next: (res) => {
          alert('File uploaded successfully!');
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Upload error:', err);
          alert('File upload failed');
        }
      });
    } else {
      alert('Please select a file before uploading.');
    }
  }

  // --- New for Question Bank Excel Upload Modal ---

  // Open/close Question Bank upload modal
  toggleQuestionBankUploadModal(show: boolean) {
    this.showUploadQnBankFile = show;
    if (!show) {
      this.clearQBankForm();
    }
  }


  // Clear question bank upload form/modal
  clearQBankForm() {
    this.selectedQBankFile = null;
  }

  // Upload Question Bank Excel File through service
  uploadQuestionBankFile() {
    if (!this.selectedQBankFile) {
      alert('Please select a file before uploading.');
      return;
    }

    this.traineeDetailsService.uploadQuestionBankExcelFile(this.selectedQBankFile).subscribe({
      next: (response) => {
        alert('Question bank file uploaded successfully!');
        this.toggleQuestionBankUploadModal(false);
        // Optionally refresh questionBank data after upload
        this.retrieveReviewDetails(); 
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('Failed to upload question bank file.');
      }
    });
  }

  deleteAllMembers() {
    const parentCheckbox = document.getElementById('parentCheckBox') as HTMLInputElement | null;
    if (parentCheckbox && parentCheckbox.checked) {
      if (confirm('Sure you want to remove all Members')) {
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
          this.deleteQuestion(i);
          ++checkedIndex;
          checkbox.checked = false;
        }
      }
      if (checkedIndex === 0) alert('Select the Members to remove');
    }
  }

  addQuestion(question: any) {
    this.traineeDetailsService.addQuestion(question).subscribe(
      (res) => {
        alert('Question Added');
        this.retrieveReviewDetails();
        this.showAddQuestion = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editQuestion(question: any) {
    if (this.editedIndex == null) return;
    const editedQuestion = {
      _id: this.questionBank[this.editedIndex]._id,
      TECHNOLOGY_NAME: question.TECHNOLOGY_NAME,
      TOPIC: question.TOPIC,
      OBJECTIVE: question.OBJECTIVE,
      WEIGHTAGE: question.WEIGHTAGE,
    };
    this.traineeDetailsService.editQuestion(editedQuestion).subscribe(
      (res) => {
        alert('Question Edited');
        this.retrieveReviewDetails();
        this.showEditMember = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
