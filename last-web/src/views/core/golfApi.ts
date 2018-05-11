import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { consts } from './consts';

@Injectable()
export class GolfApi {

    baseUrl: string = consts.host.golfBaseUrl;

    constructor(public http: Http) { }

    tournaments = () => {
        let contentHeaders = new Headers();
        contentHeaders.append('Ocp-Apim-Subscription-Key', consts.host.golfApiId1);
        return this.http.get(this.baseUrl.concat('Tournaments'), {headers: contentHeaders});
    };

    players = () => {
        let contentHeaders = new Headers();
        contentHeaders.append('Ocp-Apim-Subscription-Key', consts.host.golfApiId1);
        return this.http.get(this.baseUrl.concat('Players'), {headers: contentHeaders});
    };

}
