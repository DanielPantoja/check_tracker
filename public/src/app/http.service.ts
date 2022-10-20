import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private tokenTimer: any;
  private token: string;
  private userId: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private _http: HttpClient, private _router: Router) { }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId)
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId')
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
  private setAuthTimer(duration: number) {
    console.log("Setting timer " + duration);
    this.tokenTimer = setTimeout(() => {
      console.log(this.tokenTimer)
      this.logout();
    }, duration * 1000);
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      this.logout();
      return;
    }
    console.log(authInformation.token)
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true);
    }
  }
  signUp(newUser) {
    this._http.post<{ token: string; expiresIn: number; userId: string }>('/api/user/create', newUser)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, response.userId);
          this._router.navigate(['/home']);
        }
      })
  }
  login(email: string, password: string) {
    const authData = { email: email, password: password };
    this._http.post<{ token: string; expiresIn: number; userId: string }>('/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);//NOT SURE IF I NEED THIS
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, response.userId);
          this._router.navigate(["/home"]);
        }
      },
        error => {
          this.authStatusListener.next(false);
        }
      )
  }
  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this._router.navigate(['/'])
  }
  //CREATE FUNCTIONS
  createJob(title: string, payrate: number, taxrate: number) {
    const uId = this.getUserId();
    console.log('this is the user id ', uId)
    const jobData = { title: title, payrate: payrate, taxrate: taxrate, uId: uId };
    this._http.post('/api/job/create', jobData).subscribe(
      () => {
        this._router.navigate(['/home']);
      }
    )
  }
  createCheck(start: Date, end: Date, jId: string) {
    const checkData = { start: start, end: end, jobId: jId };
    this._http.post('/api/check/create', checkData).subscribe(
      () => {
        this._router.navigate(['/checks/',jId]);
      }
    )
  }
  createEntry(hours: number, minutes: number, date: Date, cId: string) {
    const entryData = { hours: hours, minutes: minutes, date: date, jobId: null, checkId: cId }
    this._http.post('/api/entry/create', entryData).subscribe(
      response => {
        let jId = response['jId']
        this._router.navigate(['/checks/',jId]);
      }
    )
  }
  //GET FUNCTONS
  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener;
  }
  getUserId() {
    return localStorage.getItem('userId')
  }
  getAllUserData(uId) {
    return this._http.get(`/api/user/${uId}`)
  }
  //JOB
  getJobData(jId) {
    return this._http.get(`/api/job/data/${jId}`)
  }
  getOneJob(jId) {
    return this._http.get(`/api/job/${jId}`);
  }
  //CHECK
  getCheckData(cId) {
    return this._http.get(`/api/check/data/${cId}`)
  }
  getAllChecks(uId) {
    return this._http.get(`/api/allChecks/${uId}`)
  }
  getOneCheck(cId) {
    return this._http.get(`/api/check/${cId}`);
  }
  //ENTRY
  getAllEntrys(uId) {
    return this._http.get(`/api/allEntrys/${uId}`)
  }
  getOneEntry(eId) {
    return this._http.get(`/api/entry/${eId}`)
  }
  //EDIT FUNCTION
  updateOneJob(uId, jId, updatedJob) {
    return this._http.put(`/api/job/edit/${uId}/${jId}`, updatedJob);
  }
  updateOneCheck(jId, cId, updatedCheck2) {
    return this._http.put(`/api/check/edit/${jId}/${cId}`, updatedCheck2);
  }
  updateOneEntry(eId, updatedEntry) {
    return this._http.put(`/api/entry/edit/${eId}`, updatedEntry);
  }
  //DELETE FUNCTION
  deleteJob(uId, jId) {
    return this._http.delete(`/api/job/delete/${uId}/${jId}`);
  }
  deleteCheck(cId, jId) {
    return this._http.delete(`/api/check/delete/${cId}/${jId}`);
  }
  deleteEntry(cId, eId) {
    return this._http.delete(`/api/entry/delete/${cId}/${eId}`);
  }
}
