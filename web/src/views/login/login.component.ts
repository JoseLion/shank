import { Component  } from '@angular/core';
import { Router } from '@angular/router';
import { Rest } from '../core/rest';

declare var jQuery:any;

@Component({
    selector: 'login',
    templateUrl: 'login.template.html'
})
export class LoginViewComponent {

    constructor(public router: Router, public rest: Rest) {
        jQuery('body').addClass('gray-bg')
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    login(event, email, password) {
        event.preventDefault();
        this.rest.auth(JSON.stringify({ email, password }))
        .subscribe(
            response => {
                jQuery('body').removeClass('gray-bg')
                let res = response.json().response;
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
                this.router.navigate(['./shank/users', 'admin']);
            },
            error => {
                console.log('ERROR CONSUMO SERVICIO: ',  error.text());
            }
        );
    }

}
