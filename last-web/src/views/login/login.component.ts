import { Component  } from '@angular/core';
import { Router } from '@angular/router';
import { Rest } from '../core/rest';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'login',
    templateUrl: 'login.template.html'
})
export class LoginViewComponent {

    public login: any = {};

    constructor(public router: Router, public rest: Rest, private sweetAlert : SweetAlert, private messageService : MessageService) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    doLogin = () => {
        this.rest.auth(JSON.stringify(this.login)).subscribe(
            response => {
                let res = response.json();
                if(res.error != null && res.error.length > 0) {
                    SweetAlert.errorNotif(res.error, this.messageService);
                    return;
                }
                res = res.response;
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
                this.router.navigate(['/shank/reports/dashboard']);
            },
            error => {
                console.log('ERROR CONSUMO SERVICIO: ',  error.text());
            }
        );
    };

}
