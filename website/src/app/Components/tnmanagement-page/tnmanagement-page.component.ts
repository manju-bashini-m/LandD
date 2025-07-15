import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TraineeDetailsService } from '../../Service/trainee-details.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tnmanagement-page',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './tnmanagement-page.component.html',
  styleUrls: ['./tnmanagement-page.component.css']
})
export class TnmanagementPageComponent {
  private formBuilder = inject(FormBuilder);
  private traineeDetailsService = inject(TraineeDetailsService);

  TNData: any[] = [];
  checkTNData: any[] = [];
  checkboxIndex = 1;

  showMemberManagement = false;
  showUploadFile = false;
  showEditMember = false;

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
    Last_Name: ['', Validators.required],
    Designation: ['', Validators.required],
    Team: ['', Validators.required],
    Practice: ['', Validators.required]
  });

  filterByKeyword = '';
  filterByACEID = '';
  filterByFirstName = '';
  filterByLastName = '';
  filterByDesignation = '';
  filterByTeam = '';
  selectedFile: File | null = null;

  constructor() {
    this.retrieveTNDetails();

    this.KeywordForm.valueChanges.subscribe(value => {
      this.filterData(value);
    });
  }

  retrieveTNDetails(): void {
    this.traineeDetailsService.TNDetails().subscribe(details => {
      this.TNData = details;
      this.checkTNData = [...this.TNData];
    });
  }

  showMember(): void {
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
    alert(`Successfully Added ${value.First_Name}`);
    this.showMember();
  }

  deleteMember(index: number): void {
    if (confirm(`Sure you want to Remove ${this.TNData[index].FIRST_NAME}?`)) {
      this.traineeDetailsService.deleteTNDetails(this.TNData[index]);
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
      Last_Name: member.Last_Name || '',
      Designation: member.Designation || '',
      Team: member.Team || '',
      Practice: member.Practice || ''
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
        this.traineeDetailsService.deleteAllTNDetails();
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.traineeDetailsService.TNDetailsSendExcelFile(this.selectedFile);
    } else {
      alert('Please select a file before uploading.');
    }
  }
}