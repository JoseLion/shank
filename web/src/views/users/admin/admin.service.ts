import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class AdminService {

    private baseUrl: string = 'shank.levelaptesting.com:3000/users/allUsers'
    constructor(private http : Http) {
    }

}
