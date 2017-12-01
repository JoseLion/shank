import { Component } from '@angular/core';
import { consts } from '../../core/consts';
import { Rest } from '../../core/rest';

@Component({
    selector: 'admin',
    templateUrl: 'admin.template.html'
})
export class AdminViewComponent {

    private _users: any[] = [];
    private _isLoading: boolean = true;

    constructor(private rest : Rest) {
        this.rest.post(consts.host.users, {type: 0})
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
    }

    /* GETTERS AND SETTERS */

    set users(_users:any[]) { this._users = _users; }
    get users() { return this._users; }

    set isLoading(_isLoading:boolean) { this._isLoading = _isLoading; }
    get isLoading() { return this._isLoading; }

}
