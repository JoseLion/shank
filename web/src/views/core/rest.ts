import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { consts } from './consts';
import { contentHeaders } from './contentHeaders';
// import 'rxjs/add/operator/toPromise';

@Injectable()
export class Rest {

    jwt: string;
    decodedJwt: string;
    baseUrl: string = consts.host.baseUrl;

    constructor(public http: Http, public authHttp: AuthHttp, public jwtHelper: JwtHelper, private router: Router) {
        this.jwt = localStorage.getItem('token');
    }

    checkJWT() {
        if(!this.jwt) {
            //this.router.navigate(['/login']);
            return false;
        }
        this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        return true;
    }

    openAuth(body: any) {
        return this.http.post( this.baseUrl.concat(consts.host.loginApp), body, { headers: contentHeaders });
    }

    auth(body: any) {
        return this.http.post( this.baseUrl.concat(consts.host.loginAdmin), body, { headers: contentHeaders });
    }

    get(url: string, params?: any) {
        let finalUrl = this.baseUrl.concat(url);
        if(params != null) {
            for(let param in params) {
                finalUrl = finalUrl.concat('/').concat(params[param]);
            }
        }
        contentHeaders.append('Authorization', `Bearer ${this.jwt}`);
        return this.authHttp.get(finalUrl, {headers: contentHeaders});
    }

    post(url: string, body?: any) {
        let finalUrl = this.baseUrl.concat(url);
        if(body == null) body = {};
        contentHeaders.append('Authorization', `Bearer ${this.jwt}`);
        return this.authHttp.post(finalUrl, body, {headers: contentHeaders});
    }

    put(url: string, body?: any) {
        let finalUrl = this.baseUrl.concat(url);
        console.log('URL: ', finalUrl);
        contentHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.authHttp.put(finalUrl, body, {headers: contentHeaders});
    }

    delete(url: string, params?: any) {
        let finalUrl = this.baseUrl.concat(url);
        if(params != null) {
            for(let param in params) {
                finalUrl = finalUrl.concat('/').concat(params[param]);
            }
        }
        contentHeaders.append('Authorization', `Bearer ${this.jwt}`);
        return this.authHttp.delete(finalUrl, {headers: contentHeaders});
    }

}
