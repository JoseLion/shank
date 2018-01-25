import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { consts } from 'views/core/consts';
import { Rest } from 'views/core/rest';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'user',
    templateUrl: './templates/users.html'
})
export class UserViewComponent {

    public profiles: any[] = [];
    public users: any[] = [];
    public isLoading: boolean = true;
    public title: string;
    public isAdmin: boolean;
    public display: boolean;
    public user: any = {};
    public modalHeader: string;
    public search: any = {};

    constructor(private rest : Rest, private route : ActivatedRoute, private sweetAlert : SweetAlert, private messageService : MessageService) {
        this.route.params.subscribe(params => {
            this.title = params['profile'];
            this.isAdmin = params['profile'] === 'admin';
            this.search = {profile: this.title};
            this.findUsers();
            this.rest.post('profiles/findProfiles')
            .subscribe(
                response => { this.profiles = response.json().response; },
                error => { SweetAlert.errorNotif(error.text(), this.messageService); },
                () => { this.isLoading = false; }
            );
        });
    }

    findUsers = function() {
        this.rest.post('users/findUsers', this.search)
        .subscribe(
            response => { this.users = response.json().response; },
            error => { SweetAlert.errorNotif(error.text(), this.messageService); },
            () => { this.isLoading = false; }
        );
    };

    openDialog = function(isNew, user?) {
        this.modalHeader = isNew ? 'New User' : 'Edit User';
        this.display = true;
        this.user = {};
        if(!isNew) {
            Object.assign(this.user, user);
        }
    };

    saveUser = function() {
        let _ = this;
        SweetAlert.save(function() {
            _.rest.post('users/updateApp', _.user)
            .subscribe(
                response => {
                    _.display = false;
                    _.search = {profile: _.title === 'admin' ? 1 : 2};
                    _.findUsers();
                },
                error => { SweetAlert.errorNotif(error.text(), _.messageService); },
                () => { _.isLoading = false; }
            );
        });
    };

    changeStatusUser = function(user) {
        let _ = this;
        SweetAlert.status(function() {
            user.status = !user.status;
            _.rest.post('users/updateApp', user)
            .subscribe(
                response => {
                    _.display = false;
                    _.search = {profile: _.title === 'admin' ? 1 : 2};
                    _.findUsers();
                },
                error => { SweetAlert.errorNotif(error.text(), _.messageService); },
                () => { _.isLoading = false; }
            );
        });
    };

}
