import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TraineeDetailsService } from '../../Service/trainee-details.service';

interface Trainee {
  Mail_Id: string;
  Designation?: string;
  Technology?: string;
  Practice?: string;
  PRACTICE?: string;
}

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
  private traineeDetailsService = inject(TraineeDetailsService);
  private fb = inject(FormBuilder);

  technologyList = new Set<string>();
  internList: Trainee[] = [];
  impactTraineeList: Trainee[] = [];
  tnDetails: Trainee[] = [];

  employeeList: Trainee[] = [];
  selectedDomainList: Trainee[] = [];
  selectedDomainDisplay: string[] = [];
  selectedDomainMailList: string[] = [];

  selectedCcList: string[] = [];
  selectedBccList: string[] = [];

  isShowIndividualList = false;
  selectedTeam: string = '';
  teams: string[] = [];

  mailForm: FormGroup = this.fb.group({
    selectedDomain: [''],
    subject: [''],
    subDomain: [''],
    mailContent: [''],
    selectedCc: [''],
    selectedBcc: [''],
    message: ['']
  });

  constructor() {
    this.loadTraineeData();
  }

  private loadTraineeData(): void {
    this.traineeDetailsService.impactTraineeDetails().subscribe(detail => {
      this.impactTraineeList = detail;
    });

    this.traineeDetailsService.internshipDetails().subscribe(detail => {
      this.internList = detail;
    });

    this.traineeDetailsService.TNDetails().subscribe(detail => {
      this.tnDetails = detail;
    });
  }

  private allTechList(): void {
    this.employeeList = [...this.impactTraineeList, ...this.internList];
    this.employeeList.forEach(emp => {
      if (emp.Practice) {
        this.technologyList.add(emp.Practice);
      }
    });
  }

  domainsToMail(): void {
    this.allTechList();
    const selected = this.mailForm.get('selectedDomain')?.value?.toLowerCase();

    switch (selected) {
      case 'impact trainee':
        this.isShowIndividualList = true;
        break;
      case 'internship':
        this.selectedDomainList.push(...this.internList);
        this.selectedDomainDisplay.push('Internship');
        break;
      case 'tn team':
        this.selectedDomainList.push(...this.tnDetails);
        this.selectedDomainDisplay.push('TN Team');
        break;
      case 'all':
        this.selectedDomainList = [...this.impactTraineeList, ...this.tnDetails, ...this.internList];
        this.selectedDomainDisplay = ['All'];
        break;
    }
  }

  impactTraineeMailList(): void {
    const subDomain = this.mailForm.get('subDomain')?.value?.toLowerCase();
    let list: Trainee[] = [];

    if (subDomain === 'all') {
      list = [...this.impactTraineeList];
    } else {
      list = this.impactTraineeList.filter(
        trainee => trainee.Technology?.toLowerCase() === subDomain
      );
    }

    this.selectedDomainList.push(...list);
    this.selectedDomainDisplay.push('Impact ' + this.mailForm.get('subDomain')?.value);
  }

  removeSelectedDomain(index: number): void {
    this.selectedDomainDisplay.splice(index, 1);
    this.selectedDomainList = [];
    this.isShowIndividualList = this.selectedDomainDisplay.length > 0;
  }

  ccList(): void {
    const cc = this.mailForm.get('selectedCc')?.value;
    if (cc) {
      this.selectedCcList.push(cc);
      this.mailForm.get('selectedCc')?.setValue('');
    }
  }

  removeSelectedCc(index: number): void {
    this.selectedCcList.splice(index, 1);
  }

  bccList(): void {
    const bcc = this.mailForm.get('selectedBcc')?.value;
    if (bcc) {
      this.selectedBccList.push(bcc);
      this.mailForm.get('selectedBcc')?.setValue('');
    }
  }

  removeSelectedBcc(index: number): void {
    this.selectedBccList.splice(index, 1);
  }

  sendMail(): void {
    this.selectedDomainMailList = this.selectedDomainList.map(user => user.Mail_Id);

    const mailObject = {
      to: this.selectedDomainMailList,
      Cc: this.selectedCcList,
      Bcc: this.selectedBccList,
      subject: this.mailForm.get('subject')?.value,
      mailContent: this.mailForm.get('mailContent')?.value
    };

    console.log('Sending mail with:', mailObject);
    this.traineeDetailsService.sendMail(mailObject);
  }

  discardMail(): void {
    this.mailForm.reset({
      selectedDomain: '',
      subject: '',
      subDomain: '',
      mailContent: '',
      selectedCc: '',
      selectedBcc: '',
      message: ''
    });

    this.selectedDomainList = [];
    this.selectedDomainDisplay = [];
    this.selectedDomainMailList = [];
    this.selectedCcList = [];
    this.selectedBccList = [];
    this.isShowIndividualList = false;
  }

  
}
