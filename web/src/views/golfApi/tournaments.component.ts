import { Component } from '@angular/core';
import { consts } from '../core/consts';
import { Rest } from '../core/rest';
import { GolfApi } from '../core/golfApi';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'tournaments',
    templateUrl: './templates/tournaments.template.html'
})
export class TournamentsViewComponent {

    public tournaments: any[] = [];
    public tournament: any = {};
    public dialogToAdd: boolean = false;
    public dialogToView: boolean = false;
    public dialogToAssociate: boolean = false;
    public isLoading: boolean = true;
    public tournamentsApi: any[] = [];
    public players: any[] = [];

    constructor(private rest : Rest, private golfApi : GolfApi, private sweetAlert : SweetAlert, private messageService : MessageService) {
        this.find();
        this.rest.post('players/findPlayers').subscribe(
            response => { this.players = response.json().response; },
            error => { SweetAlert.errorNotif(error.text(), this.messageService); },
            () => { this.isLoading = false; }
        );
    }

    find = () => {
        this.isLoading = true;
        this.rest.post('tournaments/findTournaments').subscribe(
            response => { this.tournaments = response.json().response; },
            error => { SweetAlert.errorNotif(error.text(), this.messageService); },
            () => { this.isLoading = false; }
        );
    };

    openDialog = function(isNew, tournament?, isAssociate?) {
        if(isNew) {
            this.tournament = null;
            this.dialogToAdd = true;
            if(this.tournamentsApi.length === 0) {
                this.golfApi.tournaments().subscribe(
                    response => { this.tournamentsApi = response.json(); },
                    error => { SweetAlert.errorNotif(error.text(), this.messageService); }
                );
            }
        } else {
            this.tournament = {};
            if(tournament.startDate) tournament.startDate = new Date(tournament.startDate);
            if(tournament.endDate) tournament.endDate = new Date(tournament.endDate);
            tournament.rounds.forEach(round => {
                round.day = new Date(round.day);
            });
            Object.assign(this.tournament, tournament);
            if(isAssociate) this.dialogToAssociate = true;
            else this.dialogToView = true;
        }
    };

    create = function() {
        if(!this.tournament) {
            SweetAlert.errorNotif('You must select a tournament', this.messageService);
            return;
        }

        SweetAlert.save(() => {
            let tournament = {
                tournamentId: this.tournament.TournamentID,
                tournamentName: this.tournament.Name,
                startDate: new Date(this.tournament.StartDate),
                endDate: new Date(this.tournament.EndDate),
                rounds: this.tournament.Rounds.map((round) => {
                    return {
                        roundId: round.RoundID,
                        number: round.Number,
                        day: new Date(round.Day)
                    };
                })
            };
            this.rest.post('tournaments/create', tournament).subscribe(
                response => { this.dialogToAdd = false; this.find(); },
                error => { SweetAlert.errorNotif(error.text(), this.messageService); },
                () => { this.isLoading = false; }
            );
        });
    };

    save = function() {
        SweetAlert.save(() => {
            this.rest.post('tournaments/update', this.tournament).subscribe(
                response => { this.dialogToView = false; this.dialogToAssociate = false; this.find(); },
                error => { SweetAlert.errorNotif(error.text(), this.messageService); },
                () => { this.isLoading = false; }
            );
        });
    };

}
