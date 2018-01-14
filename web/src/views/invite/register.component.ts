import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rest } from '../core/rest';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';

@Component({
    selector: 'register',
    templateUrl: 'templates/register.template.html'
})
export class InviteRegisterViewComponent {

    public groupToken: string;
    public signupClicked: boolean = false;
    public signupSpinner: boolean = false;
    public facebookSpinner: boolean = false;
    public signup: any = {};

    constructor(private route : ActivatedRoute, private rest: Rest, private sweetAlert : SweetAlert, private messageService : MessageService, private fb: FacebookService) {
        this.route.params.subscribe(params => {
            this.groupToken = params['groupToken'];
        });

        let initParams: InitParams = {
            appId: '520526514985916',
            xfbml: true,
            version: 'v2.11'
        };
        this.fb.init(initParams);
    }

    register() {
        this.signupClicked = true;
        let isValid = true;
        if(this.signup.fullName == null) {
            SweetAlert.errorNotif('Full name is required!', this.messageService);
            isValid = false;
        }

        if(this.signup.email == null) {
            SweetAlert.errorNotif('Email is required!', this.messageService);
            isValid = false;
        }

        if(this.signup.password == null) {
            SweetAlert.errorNotif('Password is required!', this.messageService);
            isValid = false;
        }

        if(this.signup.password !== this.signup.passwordR) {
            SweetAlert.errorNotif('Passwords must match!', this.messageService);
            isValid = false;
        }

        if(!isValid) {
            this.signupClicked = false;
            this.signupSpinner = false;
            return;
        }

        this.rest.openPost('users/register', this.signup).subscribe(
            response => {
                let res = response.json();
                if(res.error) {
                    SweetAlert.errorNotif(res.error, this.messageService);
                    return;
                }

                localStorage.setItem('token', res.response.token);
                this.rest.put(`groups/addUser/${this.groupToken}/${res.response.user._id}`)
                .subscribe(
                    finalResponse => {
                        let groupRes = finalResponse.json();
                        if(groupRes.error) {
                            SweetAlert.errorNotif(groupRes.error, this.messageService);
                            return;
                        }

                        if(groupRes.response.userAdded) {
                            SweetAlert.success('You joined to the group!', 'Download APP', () => {
                                console.log('OK BUTTON CLICKED');
                            });
                        } else {
                            SweetAlert.error('Something went wrong!', () => {
                                console.log('OK BUTTON CLICKED BAD');
                            });
                        }
                    }, error => {
                        console.error('ERROR CONSUMO SERVICIO: ',  error);
                        SweetAlert.errorNotif('Internal Server Error', this.messageService);
                    }, () => {
                        localStorage.removeItem('token');
                        this.signupClicked = false;
                        this.signupSpinner = false;
                    }
                );
            }, error => {
                console.error('ERROR CONSUMO SERVICIO: ', error);
                SweetAlert.errorNotif('Internal Server Error', this.messageService);
            }
        );
    }

    continueWithFacebook() {
        this.signupClicked = true;
        this.facebookSpinner = true;
        let loginOptions: LoginOptions = {
            scope: 'public_profile,email',
            return_scopes: true
        };
        this.fb.login(loginOptions).then((response: LoginResponse) => {
            console.log('RESPONSE: ', response);
            this.signupClicked = false;
            this.facebookSpinner = false;
        }).catch(cancel => {
            console.error('CANCEL: ', cancel);
            this.signupClicked = false;
            this.facebookSpinner = false;
            SweetAlert.errorNotif('Facebook login canceled!', this.messageService);
        });
    }

}
