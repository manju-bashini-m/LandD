import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})

export class TraineeDetailsService {

  private http = inject(HttpClient);

  // Data retrieval
  impactTraineeDetails(): Observable<any> {
    return this.http.get<any>(environment.impactTraineeDetails);
  }

  internshipDetails(): Observable<any> {
    return this.http.get<any>(environment.internshipDetails);
  }

  reviewDetails(): Observable<any> {
    return this.http.get<any>(environment.reviewDetails);
  }

  addTNMember(member: any): Observable<any> {
    let url = environment.addTNMember;
    // Use responseType:'json' because server sends JSON, not text
    console.log(url, member);
    return this.http.post<any>(url, member, { responseType: 'json' });
  }
  addTraineeMember(member: any): Observable<any> {
    let url = environment.addTraineeMember;
    // Use responseType:'json' because server sends JSON, not text
    console.log(url, member);
    return this.http.post<any>(url, member, { responseType: 'json' });
  }

  exportTNDetailsExcel(): Observable<Blob> {
    const url = `http://localhost:3300/TNDetails/export`;
    return this.http.get(url, { responseType: 'blob' });
  }
  exportTraineeDetailsExcel(): Observable<Blob> {
    const url = `http://localhost:3300/TraineeDetails/export`;
    return this.http.get(url, { responseType: 'blob' });
  }
  exportInternDetailsExcel(): Observable<Blob> {
    const url = `http://localhost:3300/InternDetails/export`;
    return this.http.get(url, { responseType: 'blob' });
  }

  TNDetails(): Observable<any> {
    return this.http.get<any>(environment.TNDetails);
  }

  // Add this inside TraineeDetailsService
  updateTNDetails(member: any): Observable<any> {
    console.log(member, "member");

    const url = `${environment.updateTNDetails}/${member.ACE_ID}`;
    return this.http.put(url, member, { responseType: 'text' });
  }

  updateTraineeDetails(member: any): Observable<any> {
    console.log(member, "member");

    const url = `${environment.updateTraineeDetails}/${member.ACE_ID}`;
    return this.http.put(url, member, { responseType: 'text' });
  }


  updateInternDetails(member: any): Observable<any> {
    console.log(member, "member");
    const url = `${environment.updateInternDetails}/${member.INT_ID}`;
    return this.http.put(url, member, { responseType: 'text' });
  }


  // Data deletion
  deleteImpactTrainee(trainees: any): Observable<any> {
    return this.http.post(environment.deleteImpactTrainee, trainees, { responseType: 'text' });
  }

  deleteAllImpactTrainees(): Observable<any> {
    return this.http.post(environment.deleteAllImpactTrainees, {}, { responseType: 'text' });
  }

  deleteInternship(trainees: any): Observable<any> {
    return this.http.post(environment.deleteInternship, trainees, { responseType: 'text' });
  }

  deleteAllInternship(): Observable<any> {
    return this.http.post(environment.deleteAllInternship, {}, { responseType: 'text' });
  }

  deleteReviewDetails(trainees: any): Observable<any> {
    return this.http.post(environment.deleteReviewDetails, trainees, { responseType: 'text' });
  }

  deleteAllReviewDetails(): Observable<any> {
    return this.http.post(environment.deleteAllReviewDetails, {}, { responseType: 'text' });
  }

  deleteTNDetails(trainees: any): Observable<any> {
    return this.http.post(environment.deleteTNDetails, trainees, { responseType: 'text' });
  }

  deleteSelectedTNDetails(memberIdList: any[]): Observable<any> {
    const body = { traineeIds: memberIdList };
    console.log("sas", environment.deleteSelectedTNDetails);
    return this.http.post(environment.deleteSelectedTNDetails, body, { responseType: 'text' });

  }

  deleteSelectedTraineeDetails(memberIdList: any[]): Observable<any> {
    const body = { traineeIds: memberIdList };
    console.log("sas", environment.deleteSelectedTraineeDetails);
    return this.http.post(environment.deleteSelectedTraineeDetails, body, { responseType: 'text' });

  }

  deleteSelectedInternDetails(memberIdList: any[]): Observable<any> {
    const body = { traineeIds: memberIdList };
    console.log("sas", environment.deleteSelectedInternDetails);
    return this.http.post(environment.deleteSelectedInternDetails, body, { responseType: 'text' });

  }

  deleteAllTNDetails(): Observable<any> {
    return this.http.post(environment.deleteAllTNDetails, {}, { responseType: 'text' });
  }

  // File upload
  sendExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    return this.http.post(`http://localhost:3300/impactTraineeExcelToDatabase`, formData);
  }

  sendFresherManagementExcelFile(file: File, collectionName: String): Observable<any> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    return this.http.post(`http://localhost:3300/fresherManagementExcelToDatabase/${collectionName}`, formData);
  }


  internshipSendExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    return this.http.post(environment.internshipExcelFile, formData);
  }

  reviewDetailsSendExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    return this.http.post(environment.reviewDetailsExcelFile, formData);
  }
  uploadQuestionBankExcelFile(file: File): Observable<any> {
  const formData = new FormData();
  if (file) formData.append('file', file);
  // Use your uploadQnBank endpoint
  return this.http.post(environment.uploadQnBank, formData);
}

  TNDetailsSendExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    console.log(file, "file");
    if (file) formData.append('file', file);
    console.log(formData, "formdata");
    return this.http.post(environment.TNDetailsExcelFile, formData);
  }

  reviewFormDetails(value: any): Observable<any> {
    return this.http.post(environment.reviewFormDetails, value, { responseType: 'text' });
  }

  sendMail(mailDetails: any): Observable<any> {
    return this.http.post(environment.sendMail, mailDetails, { responseType: 'text' });
  }

  getQuestionBank(): Observable<any> {
    return this.http.get(environment.questionBank);
  }

  addQuestion(question: any): Observable<any> {
    return this.http.post(environment.addQuestion, question, { responseType: 'text' });
  }

  editQuestion(question: any): Observable<any> {
    return this.http.post(environment.editQuestion, question, { responseType: 'text' });
  }

  deleteQuestion(question: any): Observable<any> {
    return this.http.post(environment.deleteQuestion, question, { responseType: 'text' });
  }

  updateMarks(marksDetails: any): Observable<any> {
    return this.http.post(environment.updateMarks, marksDetails, { responseType: 'text' });
  }

  aiSuggestion(marks: any): Observable<any> {
    return this.http.post(environment.aiSuggestion, marks, { responseType: 'text' });
  }

  sendSuggestionMail(ccMails: any, toMail: any): Observable<any> {
    const mailDetails = { ccMail: ccMails, toMail: toMail };
    return this.http.post(environment.sendSuggestionMail, mailDetails, { responseType: 'text' });
  }

  downloadExcel() {
    return this.http.get(environment.downloadExcel, {
      responseType: 'blob'
    });
  }
}