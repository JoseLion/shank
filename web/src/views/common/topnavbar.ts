import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { smoothlyMenu } from 'app/app.helpers';
declare var jQuery:any;

@Component({
    selector: 'topnavbar',
    templateUrl: './template/topnavbar.html'
})
export class TopnavbarComponent {

    private _user: any;

    constructor(public router: Router) {
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    toggleNavigation(): void {
        jQuery('body').toggleClass('mini-navbar');
        smoothlyMenu();
    }

    logout(): void {
        // localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    /* GETTERS AND SETTERS */
    set user(_user:any){ this._user = _user; }
    get user():any { return this._user; }

}
