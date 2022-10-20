import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CheckTrackerComponent } from './check-tracker/check-tracker.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { AddJobComponent } from './add-job/add-job.component';
import { AddCheckComponent } from './add-check/add-check.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { EditCheckComponent } from './edit-check/edit-check.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { ChecksComponent } from './checks/checks.component';
import { EntrysComponent } from './entrys/entrys.component';
import { AllChecksComponent } from './all-checks/all-checks.component';
import { AllEntrysComponent } from './all-entrys/all-entrys.component';

const routes: Routes = [
  {path : 'login', component: LoginComponent},
  {path : 'signup', component: SignUpComponent},
  {path : 'home', component: HomeComponent,canActivate:[AuthGuard]},
  //Forms
  {path : 'add-job', component: AddJobComponent, canActivate:[AuthGuard]},
  {path : 'add-check/:jId', component: AddCheckComponent, canActivate:[AuthGuard]},
  {path : 'add-entry/:cId', component: AddEntryComponent, canActivate:[AuthGuard]},
  //Displays
  {path : 'checks/:jId', component: ChecksComponent, canActivate:[AuthGuard]},
  {path : 'entrys/:cId', component: EntrysComponent , canActivate:[AuthGuard]},
  {path : 'all-checks', component: AllChecksComponent, canActivate:[AuthGuard]},
  {path : 'all-entrys', component: AllEntrysComponent, canActivate:[AuthGuard]},
  //Edit Forms
  {path : 'job-edit/:jId', component: EditJobComponent, canActivate:[AuthGuard]},
  {path : 'check-edit/:cId', component: EditCheckComponent, canActivate:[AuthGuard]},
  {path : 'entry-edit/:eId', component: EditEntryComponent, canActivate:[AuthGuard]},
  {path: '', component: CheckTrackerComponent},
  {path : "", pathMatch: "full", redirectTo: '/'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: 
  [
    AuthGuard,
]
})
export class AppRoutingModule { }
