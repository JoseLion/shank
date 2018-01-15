import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rest } from '../core/rest';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';

@Component({
    selector: 'login',
    templateUrl: 'templates/login.template.html'
})
export class InviteLoginViewComponent {

    public groupToken: string;
    public loginClicked: boolean = false;
    public loginSpinner: boolean = false;
    public facebookSpinner: boolean = false;

    constructor(private route : ActivatedRoute, private rest: Rest, private sweetAlert : SweetAlert, private messageService : MessageService, private fb : FacebookService) {
        this.route.params.subscribe(params => {
            this.groupToken = params['groupToken'];
        });

        let initParams: InitParams = {
            appId: '520526514985916',
            version: 'v2.11'
        };
        this.fb.init(initParams);
    }

    login(event, email, password) {
        this.loginClicked = true;
        event.preventDefault();
        this.rest.openAuth({ email, password })
        .subscribe(
            response => {
                let res = response.json();
                if(res.error) {
                    SweetAlert.errorNotif(res.error, this.messageService);
                    this.loginClicked = false;
                    this.loginSpinner = false;
                    return;
                }

                localStorage.setItem('token', res.response.token);
                this.rest.put(`groups/addUser/${this.groupToken}/${res.response.user._id}`)
                .subscribe(
                    finalResponse => {
                        let groupRes = finalResponse.json();

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
                        SweetAlert.errorNotif(error.text(), this.messageService);
                        console.log('ERROR CONSUMO SERVICIO: ',  error);
                    }, () => {
                        console.log('AFTER EVERYTHING: ');
                        localStorage.removeItem('token');
                        this.loginClicked = false;
                        this.loginSpinner = false;
                    }
                );
            }, error => {
                SweetAlert.errorNotif(error.text(), this.messageService);
                console.log('ERROR CONSUMO SERVICIO: ', error);
            }
        );
    }

    continueWithFacebook() {
        this.loginClicked = true;
        this.facebookSpinner = true;
        let loginOptions: LoginOptions = {
            enable_profile_selector: true,
            scope: 'public_profile,email',
            return_scopes: true
        };
        this.fb.login(loginOptions).then((loginResponse: LoginResponse) => {
            this.fb.api(`/me?fields=id,name,email,picture&access_token=${loginResponse.authResponse.accessToken}`).then((profile : any) => {
                if (profile.email) {
                    let data = {
                        fullName: profile.name,
                        email: profile.email,
                        facebookId: profile.id,
                        photo: {
                            name: 'facebook',
                            path: profile.picture.data.url
                        }
                    };
                    this.rest.openPost('users/facebookSignin', data).subscribe(
                        response => {
                            let res = response.json();
                            if(res.error) {
                                SweetAlert.errorNotif(res.error, this.messageService);
                                this.loginClicked = false;
                                this.loginSpinner = false;
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
                                    this.loginClicked = false;
                                    this.facebookSpinner = false;
                                }
                            );
                        }, error => {
                            console.error('ERROR CONSUMO SERVICIO: ', error);
                            SweetAlert.errorNotif('Internal Server Error', this.messageService);
                        }
                    );
                }
            }).catch(error => {
                console.error('ERROR: ', error);
                this.loginClicked = false;
                this.facebookSpinner = false;
                SweetAlert.errorNotif('Facebook login canceled!', this.messageService);
            });
        }).catch(cancel => {
            console.error('CANCEL: ', cancel);
            this.loginClicked = false;
            this.facebookSpinner = false;
            SweetAlert.errorNotif('Facebook login canceled!', this.messageService);
        });
    }

}
