import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'invite',
    templateUrl: 'templates/invite.template.html'
})
export class InviteViewComponent {

    public groupToken: string;

    constructor(private route : ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.groupToken = params['groupToken'];
        });
        this.openUrl();
    }

    openUrl = () => {
        window.location.href = `Shank://group=${this.groupToken}`;
    };

    openAndroid = () => {
        window.location.href = `market://details?id=com.levelap.shank`;
    };

    openIos = () => {
        window.location.href = `market://details?id=com.levelap.shank`;
    };

}
