import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../contentHeaders';
import { consts } from '../consts';

@Component({
    selector: 'login',
    templateUrl: 'login.template.html'
})
export class LoginViewComponent {

    constructor(public router: Router, public http: Http) {
    }

    login(event, email, password) {
        event.preventDefault();
        let body = JSON.stringify({ email, password });
        console.log(body)
        this.http.post(consts.baseUrl + 'loginAdmin', body, { headers: contentHeaders })
        .subscribe(
            response => {
                console.log('RESPUESTA: ', response);
                localStorage.setItem('id_token', response.json().id_token);
                this.router.navigate(['user/admin']);
            },
            error => {
                console.log(error.text());
            }
        );
    }

}
