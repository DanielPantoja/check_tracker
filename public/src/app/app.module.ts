import { AppRoutingModule } from './app-routing.module';
import { HttpService } from './http.service';
import { AuthInterceptor } from './auth-interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from '@angular/cdk/layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

//Components
import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CheckTrackerComponent } from './check-tracker/check-tracker.component';
import { HomeComponent } from './home/home.component';
import { AllChecksComponent } from './all-checks/all-checks.component';
import { AllEntrysComponent } from './all-entrys/all-entrys.component';
import { ChecksComponent } from './checks/checks.component';
import { EntrysComponent } from './entrys/entrys.component';
import { AddJobComponent } from './add-job/add-job.component';
import { AddCheckComponent } from './add-check/add-check.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { EditCheckComponent } from './edit-check/edit-check.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { ErrorComponent } from './error/error.component';
import { ValidatorComponent } from './validator/validator.component';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    CheckTrackerComponent,
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    AllChecksComponent,
    AllEntrysComponent,
    ChecksComponent,
    EntrysComponent,
    AddJobComponent,
    AddCheckComponent,
    AddEntryComponent,
    EditJobComponent,
    EditCheckComponent,
    EditEntryComponent,
    ErrorComponent,
    ValidatorComponent,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    LayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [
    HttpService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }
