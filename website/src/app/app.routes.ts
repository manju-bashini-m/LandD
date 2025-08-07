import { Routes } from '@angular/router';
import { ReviewIndividualComponent } from './Components/review-individual/review-individual.component';
import { ReviewFormComponent } from './Components/review-form/review-form.component';
import { ReviewTraineeComponent } from './Components/review-trainee/review-trainee.component';
import { ReviewPendingComponent } from './Components/review-pending/review-pending.component';
import { ImpactTrainingPageComponent } from './Components/impact-training-page/impact-training-page.component';
import { InternshipComponent } from './Components/internship/internship.component';
import { TnmanagementPageComponent } from './Components/tnmanagement-page/tnmanagement-page.component';
import { QuestionBankComponent } from './Components/question-bank/question-bank.component';
import { DashboardPageComponent } from './Components/dashboard-page/dashboard-page.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { TnStructureComponent } from './Components/tn-structure/tn-structure.component';
import { EmailComponent } from './Components/email/email.component';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
     {
          path:"",
          component: LoginComponent
     },
     {
          path: "homePage",
          component: HomePageComponent,
          children: [
               {
                    path: "",
                    pathMatch: "full",
                    redirectTo: "dashboard"
               },
               {
                    path: "dashboard",
                    component: DashboardPageComponent,
                    title:"Dashboard"
               },
               {
                    path: "tn-management",
                    component: TnmanagementPageComponent,
                    title:"TN Management"
               },
               {
                    path:"tn-management/TN_Structure",
                    component: TnStructureComponent,
                    title:"TN Structure"
               },
               {
                    path:"fresherManagement/impact-training",
                    component:ImpactTrainingPageComponent,
                    title:"Impact Training"
               },
               {
                    path:"fresherManagement/Internship",
                    component:InternshipComponent,
                    title:"Internship"
               },
               {
                    path:"reviewReports/reviewIndividual",
                    component:ReviewIndividualComponent,
                    title:"Review Individuals"
               },
               {
                    path:"reviewReports/reviewPending",
                    component:ReviewPendingComponent,
                    title:"Review Pending"
               },
               {
                    path:"reviewReports/reviewTrainee",
                    component:ReviewTraineeComponent,
                    title:"Review Trainee"
               },
               {
                    path:"reviewReports/reviewForm",
                    component:ReviewFormComponent,
                    title:"Review Form"
               },
               {
                    path:'reviewReports/questionBank',
                    component:QuestionBankComponent,
                    title:"Question Bank"
               },
               {
                    path:'email',
                    component: EmailComponent,
                    title:"email"
               }
          ]
     },
];