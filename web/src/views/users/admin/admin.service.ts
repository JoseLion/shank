import { Injectable } from '@angular/core';
import { Http, Headers, XSRFStrategy } from '@angular/http';

@Injectable()
export class AdminService {

    private baseUrl: string = 'http://shank.levelaptesting.com:3000/api/users/allUsers';
    private headers = new Headers({'Accept': 'application/json','Content-Type': 'application/json'});

    constructor(private http : Http) {}

    getUsers(): Promise<any[]> {
        console.log(this.baseUrl);
        return this.http.get(this.baseUrl, { headers: this.headers})
        .toPromise()
        .then(res => { res.json().data as any[]})
        .catch(this.handleError)
        //     .map(res => { return res.json(); });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
