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
        pfp: { code: 'PFP', name: 'First Place', value : 0, type: 'number' },
        psp: { code: 'PSP', name: 'Second Place', value : 0, type: 'number' },
        ptp: { code: 'PTP', name: 'Third Place', value : 0, type: 'number' },
        php: { code: 'PHP', name: 'Fourth Place', value : 0, type: 'number' },
        pvp: { code: 'PVP', name: 'Five Place', value : 0, type: 'number' },
        pfd: { code: 'PFD', name: 'Day 1', value : 0, type: 'number' },
        psd: { code: 'PSD', name: 'Day 2', value : 0, type: 'number' },
        ptd: { code: 'PTD', name: 'Day 3', value : 0, type: 'number' },
        phd: { code: 'PHD', name: 'Day 4', value : 0, type: 'number' },
        pvd: { code: 'PVD', name: 'Day 5', value : 0, type: 'number' },
        pxd: { code: 'PXD', name: 'Day 6', value : 0, type: 'number' },
        ped: { code: 'PED', name: 'Day 7', value : 0, type: 'number' },
        pid: { code: 'PID', name: 'Day 8', value : 0, type: 'number' },
        pnd: { code: 'PND', name: 'Day 9', value : 0, type: 'number' },
        pod: { code: 'POD', name: 'Day 10', value : 0, type: 'number' }
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
