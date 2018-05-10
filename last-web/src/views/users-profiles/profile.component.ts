import { Component } from '@angular/core';
import { consts } from 'views/core/consts';
import { Rest } from 'views/core/rest';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'profile',
    templateUrl: './templates/profiles.html'
})
export class ProfileViewComponent {

    public profiles: any[];
    public isLoading: boolean = true;

    constructor(private rest : Rest, private sweetAlert : SweetAlert, private messageService : MessageService) {
        this.rest.post('profiles/findProfiles')
        .subscribe(
            response => { this.profiles = response.json().response; },
            error => { SweetAlert.errorNotif(error.text(), this.messageService); },
            () => { this.isLoading = false;
            }
        );
    }

}
