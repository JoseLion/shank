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

    private _profiles: any[] = [];
    private _users: any[] = [];
    private _isLoading: boolean = true;
    private _title: string;
    private _isAdmin: boolean;
    private _display: boolean;
    private _user: any = {};
    private _modalHeader: string;
    private _search: any = {};

    constructor(private rest : Rest, private route : ActivatedRoute, private sweetAlert : SweetAlert, private messageService : MessageService) {
        this.route.params.subscribe(params => {
            this.title = params['profile'];
            this.isAdmin = params['profile'] === 'admin';
            this.search = {profile: this.title === 'admin' ? 1 : 2};
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
    }

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

    /* GETTERS AND SETTERS */

    set profiles(_profiles:any[]) { this._profiles = _profiles; }
    get profiles() { return this._profiles; }

    set users(_users:any[]) { this._users = _users; }
    get users() { return this._users; }

    set isLoading(_isLoading:boolean) { this._isLoading = _isLoading; }
    get isLoading() { return this._isLoading; }

    set title(_title:string) { this._title = _title; }
    get title() { return this._title; }

    set isAdmin(_isAdmin:boolean) { this._isAdmin = _isAdmin; }
    get isAdmin() { return this._isAdmin; }

    set display(_display:boolean) { this._display = _display; }
    get display() { return this._display; }

    set user(_user:any[]) { this._user = _user; }
    get user() { return this._user; }

    set modalHeader(_modalHeader:string) { this._modalHeader = _modalHeader; }
    get modalHeader() { return this._modalHeader; }

    set search(_search:any) { this._search = _search; }
    get search() { return this._search; }

}
