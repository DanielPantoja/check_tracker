import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _http: HttpService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this._http.getToken();
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
