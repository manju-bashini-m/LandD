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


export const routes: Routes = [
     {
          path: '',
          component: HomePageComponent,
          children: [
               {
                    path: "",
                    pathMatch: "full",
                    redirectTo: "dashboard"
               },
               {
                    path: "dashboard",
                    component: DashboardPageComponent
               },
               {
                    path: "tn-management",
                    component: TnmanagementPageComponent
               },
                {  path:"tn-management/TN_Structure",
                        component: TnStructureComponent
                },
                {path:"reviewReports/reviewIndividual",component:ReviewIndividualComponent},
                {path:"reviewReports/reviewPending",component:ReviewPendingComponent},
                {path:"reviewReports/reviewTrainee",component:ReviewTraineeComponent},
                {path:"reviewReports/reviewForm",component:ReviewFormComponent},
                {path:"fresherManagement/impact-training",component:ImpactTrainingPageComponent},
                {path:"fresherManagement/Internship",component:InternshipComponent},
                {path:'tnmanagementPage',component:TnmanagementPageComponent},
                {path:'reviewReports/questionBank',component:QuestionBankComponent},
          ]
     },
];