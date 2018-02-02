import { Component } from '@angular/core';
import { consts } from '../core/consts';
import { Rest } from '../core/rest';
import { GolfApi } from '../core/golfApi';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'players',
    templateUrl: './templates/players.template.html'
})
export class PlayersViewComponent {

    public players: any[] = [];
    public isLoading: boolean = true;
    public playersApi: any[] = [];
    public totalPlayers: number = 0;
    public totalToCheck: number = 0;

    constructor(private rest : Rest, private golfApi : GolfApi, private sweetAlert : SweetAlert, private messageService : MessageService, private confirmationService: ConfirmationService) {
        this.find();
    }

    find = () => {
        this.isLoading = true;
        this.rest.post('players/findPlayers').subscribe(
            response => { this.players = response.json().response; },
            error => { SweetAlert.errorNotif(error.text(), this.messageService); },
            () => { this.isLoading = false; }
        );
    };

    updatePlayers = () => {
        this.confirmationService.confirm({
            message: 'You will save the information',
            accept: () => {
                //Actual logic to perform a confirmation
            }
        });

        // SweetAlert.save(() => {
        //     if(this.playersApi.length === 0) {
        //         this.golfApi.players().subscribe(
        //             response => {
        //                 this.playersApi = response.json();
        //                 this.totalPlayers = this.playersApi.length;
        //                 this.savePlayers();
        //             },
        //             error => { SweetAlert.errorNotif(error.text(), this.messageService); }
        //         );
        //     } else {
        //         this.savePlayers();
        //     }
        // });
    };

    savePlayers = () => {
        this.totalToCheck = 0;
        this.playersApi.forEach(player => {
            this.rest.post('players/save', player).subscribe(
                response => { this.checkToCloseSweet(); },
                error => { SweetAlert.errorNotif(error.text(), this.messageService); }
            );

        })
    };

    checkToCloseSweet = () => {
        if(this.totalPlayers == ++this.totalToCheck) {
            SweetAlert.successNotif('Data saved!', this.messageService);
            SweetAlert.close();
            this.find();
        }
    };

}
