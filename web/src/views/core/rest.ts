import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { consts } from './consts';
import { contentHeaders } from './contentHeaders';

@Injectable()
export class Rest {

    jwt: string;
    decodedJwt: string;
    baseUrl: string = consts.host.baseUrl;

    constructor(public http: Http, public authHttp: AuthHttp, public jwtHelper: JwtHelper) {
        // this.jwt = localStorage.getItem('token');
        // if(this.jwt != null) {
        //     this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        // }
    }

    auth(body: any) {
        return this.http.post( this.baseUrl.concat(consts.host.login), body, { headers: contentHeaders });
    }

    get(url: string, params?: any) {
        let finalUrl = this.baseUrl.concat(url);
        if(params != null) {
            console.log(params)
            for(let param in params) {
                finalUrl = finalUrl.concat('/').concat(params[param]);
                console.log(param);
            }
            // forEach(params, param => {
            //     console.log(param);
            // })
        }

        this.jwt = localStorage.getItem('token');
        if(this.jwt != null) {
            this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        }
        console.log(finalUrl);
        return this.authHttp.get(finalUrl, {headers: contentHeaders});
    }

    post(url: string, body: any) {
        let finalUrl = this.baseUrl.concat(url);
        this.jwt = localStorage.getItem('token');
        if(this.jwt != null) {
            this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        }
        return this.authHttp.post(finalUrl, body, {headers: contentHeaders});
    }

}
