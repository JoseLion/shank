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

    private _settings: any = {
        ppm: { code: 'PPM', name: 'Price Per Payment', value : 0, type: 'number' },
        pfp: { code: 'PFP', name: 'First Place', value : 0, type: 'number' },
        psp: { code: 'PSP', name: 'Second Place', value : 0, type: 'number' },
        ptp: { code: 'PTP', name: 'Second Place', value : 0, type: 'number' },
        pfd: { code: 'PFD', name: 'Day 1', value : 0, type: 'number' },
        psd: { code: 'PSD', name: 'Day 2', value : 0, type: 'number' },
        ptd: { code: 'PTD', name: 'Day 3', value : 0, type: 'number' }
    };

    constructor(private rest : Rest, private sweetAlert : SweetAlert, private messageService : MessageService) {
        for(let setting in this.settings) {
            this.rest.get('appSettings/findByCode', {code: this.settings[setting].code})
                .subscribe(
                    response => {
                        let res = response.json().response;
                        if(res._id) this.settings[setting] = response.json().response;
                    },
                    error => {
                        console.log('ERROR CONSUMO SERVICIO: ',  error.text());
                    }
                );
        }
    }

    saveSettings = function() {
        let _ = this;
        SweetAlert.save(function() {
            _.rest.post('appSettings/masiveCreateUpdate', _.settings)
            .subscribe(
                response => {
                    let res = response.json().response;
                    SweetAlert.successNotif('Data saved!', _.messageService);
                    SweetAlert.close();
                },
                error => {
                    SweetAlert.close();
                }
            );
        });
    };

    /* GETTERS AND SETTERS */
    set settings(_settings: any) { this._settings = _settings; }
    get settings():any { return this._settings; }

}
