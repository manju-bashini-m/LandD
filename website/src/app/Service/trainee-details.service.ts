import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';

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
 
  TNDetails(): Observable<any> {
    return this.http.get<any>(environment.TNDetails);
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
 
  deleteAllTNDetails(): Observable<any> {
    return this.http.post(environment.deleteAllTNDetails, {}, { responseType: 'text' });
  }
 
  // File upload
  sendExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    return this.http.post(environment.impactTraineeExcelFile, formData);
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
    if (file) formData.append('file', file);
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

  downloadExcel(){
    return this.http.get(environment.downloadExcel, {
    responseType: 'blob'
  });
  }
}