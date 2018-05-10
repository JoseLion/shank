import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { smoothlyMenu } from 'app/app.helpers';
import { MenuItem } from 'primeng/primeng';
declare var jQuery:any;

@Component({
    selector: 'topnavbar',
    templateUrl: './template/topnavbar.html'
})
export class TopnavbarComponent {

    public user: any;
    public options: MenuItem[] = [{
        label: 'Logout', icon: 'fa-sign-out', command: (event) => {
            this.router.navigate(['/login']);
        }
    }];

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

}
