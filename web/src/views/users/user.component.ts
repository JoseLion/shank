import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { consts } from '../core/consts';
import { Rest } from '../core/rest';

@Component({
    selector: 'user',
    templateUrl: 'user.template.html'
})
export class UserViewComponent {

    private _users: any[] = [];
    private _isLoading: boolean = true;
    private _title: string;

    constructor(private rest : Rest, private route : ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.title = params['profile'];
            this.rest.post(consts.host.users, {profile: this.title === 'admin' ? 1 : 2})
            .subscribe(
                response => {
                    let res = response.json().response;
                    this.users = res;
                },
                error => {
                    console.log('ERROR CONSUMO SERVICIO: ',  error.text());
                },
                () => {
                    this.isLoading = false;
                }
            );
        })
    }

    /* GETTERS AND SETTERS */

    set users(_users:any[]) { this._users = _users; }
    get users() { return this._users; }

    set isLoading(_isLoading:boolean) { this._isLoading = _isLoading; }
    get isLoading() { return this._isLoading; }

    set title(_title:string) { this._title = _title; }
    get title() { return this._title; }

}
