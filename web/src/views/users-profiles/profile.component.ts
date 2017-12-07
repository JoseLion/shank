import { Component } from '@angular/core';
import { consts } from 'views/core/consts';
import { Rest } from 'views/core/rest';

@Component({
    selector: 'profile',
    templateUrl: './templates/profiles.html'
})
export class ProfileViewComponent {

    private _profiles: any[];
    private _isLoading: boolean = true;

    constructor(private rest : Rest) {
        this.rest.post('findProfiles', {})
        .subscribe(
            response => {
                let res = response.json().response;
                this.profiles = res;
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

    set profiles(_profiles:any[]) { this._profiles = _profiles; }
    get profiles() { return this._profiles; }

    set isLoading(_isLoading:boolean) { this._isLoading = _isLoading; }
    get isLoading():boolean { return this._isLoading; }

}
