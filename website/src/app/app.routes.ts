import { Routes } from '@angular/router';
import { ReviewIndividualComponent } from './Components/review-individual/review-individual.component';
import { ReviewFormComponent } from './Components/review-form/review-form.component';
import { ReviewTraineeComponent } from './Components/review-trainee/review-trainee.component';
import { ReviewPendingComponent } from './Components/review-pending/review-pending.component';
import { ImpactTrainingPageComponent } from './Components/impact-training-page/impact-training-page.component';
import { InternshipComponent } from './Components/internship/internship.component';
import { TnmanagementPageComponent } from './Components/tnmanagement-page/tnmanagement-page.component';
import { QuestionBankComponent } from './Components/question-bank/question-bank.component';

export const routes: Routes = [
    {path:"reviewIndividual",component:ReviewIndividualComponent},
    {path:"reviewPending",component:ReviewPendingComponent},
    {path:"reviewTrainee",component:ReviewTraineeComponent},
    {path:"reviewForm",component:ReviewFormComponent},
    {path:"impactTrainingPage",component:ImpactTrainingPageComponent},
    {path:"internship",component:InternshipComponent},
    {path:'tnmanagementPage',component:TnmanagementPageComponent},
    {path:'questionBank',component:QuestionBankComponent}
];