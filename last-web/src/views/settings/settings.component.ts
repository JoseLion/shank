import { Component } from '@angular/core';
import { consts } from '../core/consts';
import { Rest } from '../core/rest';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'settings',
    templateUrl: 'settings.template.html'
})
export class SettingsViewComponent {

    public settings: any = {
        ppm: { code: 'PPM', name: 'Price Per Payment', value : 0, type: 'number' },
        pfp: { code: 'P1', name: 'First Place', value : 0, type: 'number' },
        psp: { code: 'P2', name: 'Second Place', value : 0, type: 'number' },
        ptp: { code: 'P3', name: 'Third Place', value : 0, type: 'number' },
        php: { code: 'P4', name: 'Fourth Place', value : 0, type: 'number' },
        pvp: { code: 'P5', name: 'Five Place', value : 0, type: 'number' },
        pfd: { code: 'F1', name: 'Day 1', value : 0, type: 'number' },
        psd: { code: 'F2', name: 'Day 2', value : 0, type: 'number' },
        ptd: { code: 'F3', name: 'Day 3', value : 0, type: 'number' },
        phd: { code: 'F4', name: 'Day 4', value : 0, type: 'number' },
        pvd: { code: 'F5', name: 'Day 5', value : 0, type: 'number' },
        pxd: { code: 'F6', name: 'Day 6', value : 0, type: 'number' },
        ped: { code: 'F7', name: 'Day 7', value : 0, type: 'number' },
        pid: { code: 'F8', name: 'Day 8', value : 0, type: 'number' },
        pnd: { code: 'F9', name: 'Day 9', value : 0, type: 'number' },
        pod: { code: 'F10', name: 'Day 10', value : 0, type: 'number' }
    };
    public isLoading: boolean = true;

    constructor(private rest : Rest, private sweetAlert : SweetAlert, private messageService : MessageService) {
        for(let setting in this.settings) {
            this.rest.get('appSettings/findByCode', {code: this.settings[setting].code})
                .subscribe(
                    response => {
                        let res = response.json().response;
                        if(res._id)
                            this.settings[setting] = response.json().response;
                    },
                    error => { SweetAlert.errorNotif(error.text(), this.messageService); },
                    () => { this.isLoading = false; }
                );
        }
    }

    saveSettings = function() {
        // let _ = this;
        SweetAlert.save(() => {
            this.rest.post('appSettings/masiveCreateUpdate', this.settings)
            .subscribe(
                response => {
                    let res = response.json().response;
                    SweetAlert.successNotif('Data saved!', this.messageService);
                    SweetAlert.close();
                },
                error => {
                    SweetAlert.close();
                }
            );
        });
    };

}
