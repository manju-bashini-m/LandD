import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TraineeDetailsService } from '../../Service/trainee-details.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tnmanagement-page',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './tnmanagement-page.component.html',
  styleUrls: ['./tnmanagement-page.component.css']
})
export class TnmanagementPageComponent {
  private formBuilder = inject(FormBuilder);
  private traineeDetailsService = inject(TraineeDetailsService);
  selectedFile: File | null = null;
  TNData: any[] = [];
  checkTNData: any[] = [];
  checkboxIndex = 1;

  showMemberManagement = false;
  showUploadFile = false;
  showEditMember = false;

  memberForm: FormGroup = this.formBuilder.group({
    ACE_ID: ['ACE1234', Validators.required],
    First_Name: ['Sam', Validators.required],
    Last_Name: ['S', Validators.required],
    Designation: ['student', Validators.required],
    Mail_ID: ['Sam@gmail.com', Validators.required],
    Password: ['Sam@123', Validators.required],
    Team: ['TN team', Validators.required],
    Practice: ['Training team', Validators.required]
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


  constructor() {
    this.retrieveTNDetails();

    this.KeywordForm.valueChanges.subscribe(value => {
      this.filterData(value);
    });
  }

  retrieveTNDetails(): void {
    this.traineeDetailsService.TNDetails().subscribe(details => {
      // console.log(details);
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

  addMember(data: any): void {
    // Create new object with UPPERCASE keys (all caps)
    const capitalizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key.toUpperCase(),
        value
      ])
    );
    console.log(capitalizedData, "Capitalized data");

    this.traineeDetailsService.addTNMember(capitalizedData).subscribe({
      next: (response) => {
        console.log(response, "ffff");
        alert('Successfully Added');
        this.TNData.push(capitalizedData);
        this.showMember();
      },
      error: (err) => {
        console.error('Member creation failed:', err);
        alert('Failed to create member. Please try again.');
      },
      complete: () => {
        console.log('Member Created successfully.');
      }
    });
  }



  // deleteMember(index: number): void {
  //   if (confirm(`Sure you want to Remove ${this.TNData[index].FIRST_NAME}?`)) {
  //     this.traineeDetailsService.deleteTNDetails(this.TNData[index]);
  //     this.TNData.splice(index, 1);
  //     this.checkTNData = [...this.TNData];
  //   }
  // }
  deleteMember(index: number): void {
    if (confirm(`Sure you want to Remove ${this.TNData[index].FIRST_NAME}?`)) {
      const member = this.TNData[index];

      this.traineeDetailsService.deleteTNDetails(member).subscribe({
        next: (response) => {
          console.log('Deleted successfully:', response);
          this.TNData.splice(index, 1);
          this.checkTNData = [...this.TNData];
        },
        error: (err) => {
          console.error('Deletion failed:', err);
          alert('Failed to delete member. Please try again.');
        },
        complete: () => {
          console.log('Delete request completed.');
        }
      });
    }
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
      let memberIdList = [];
      for (let i = 0; i < this.TNData.length; i++) {
        const checkbox = document.getElementById(`checkbox${i}`) as HTMLInputElement | null;
        if (checkbox && checkbox.checked) {
          // this.deleteMember(i);
          const member = this.TNData[i];
          memberIdList.push(member._id);
          checkedIndex++;
          checkbox.checked = false;
        }
      }
      this.traineeDetailsService.deleteSelectedTNDetails(memberIdList).subscribe({
        next: (response) => {
          console.log('Deleted successfully:', response);
          // Remove deleted members from TNData as needed or reload data from backend
          this.TNData = this.TNData.filter(m => !memberIdList.includes(m._id));
          this.checkTNData = [];
        },
        error: (err) => {
          console.error('Deletion failed:', err);
          alert('Failed to delete member. Please try again.');
        },
        complete: () => {
          console.log('Delete request completed.');
        }
      });
      console.log(memberIdList, "memberlistid");
      if (checkedIndex === 0) {
        alert('Select the Members to remove');
      }
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
      First_Name: member.FIRST_NAME || '',
      Last_Name: member.LAST_NAME || '',
      Designation: member.DESIGNATION || '',
      Team: member.TEAM || '',
      Practice: member.PRACTICE || ''
    });
  }

  EditedMemberDetails(value: any): void {

    const index = this.TNData.findIndex(item => item.ACE_ID === value.ACE_ID);
    if (index !== -1) {
      this.TNData[index] = value;
    }
    this.showEdit();
  }


  downloadExcel() {
    this.traineeDetailsService.exportTNDetailsExcel().subscribe({
      next: (blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TNDetails.xlsx';
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
        alert('Failed to download Excel file.');
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onEditSubmitClicked(): void {
    if (this.editMemberForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }
    const editedMember = this.editMemberForm.value;
    console.log(editedMember);
    this.traineeDetailsService.updateTNDetails(editedMember).subscribe({
      next: (response) => {
        // alert('Member updated successfully!');
        console.log("sample", response);
        let responseParsed = JSON.parse(response);
        // Find index by ACE_ID from the response (for accuracy)
        const idx = this.TNData.findIndex(x => x.ACE_ID === responseParsed.ACE_ID);
        console.log(idx);
        if (idx !== -1) {
          // Replace the element at idx with the parsed response
          this.TNData[idx] = { ...this.TNData[idx], ...responseParsed };
          // this.TNData[idx] = responseParsed;
        }

        // this.showEdit();
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update member. Please try again.');
      }
    });
  }


  // uploadFile(): void {
  //   // console.log("adsaaf", this.selectedFile);
  //   if (this.selectedFile) {
  //     this.traineeDetailsService.TNDetailsSendExcelFile(this.selectedFile);
  //     this.showFileUpload();
  //   } else {
  //     alert('Please select a file before uploading.');
  //   }
  // }

  uploadFile(): void {
    if (this.selectedFile) {
      this.traineeDetailsService.sendFresherManagementExcelFile(this.selectedFile,"TNDetails").subscribe({
        next: (res) => {
          alert('File uploaded successfully.');
          this.retrieveTNDetails();
          this.clearForm();
          this.showFileUpload(); 
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


}