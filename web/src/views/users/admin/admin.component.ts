import { Component } from '@angular/core';
import { AdminService } from './admin.service';

@Component({
    selector: 'admin',
    templateUrl: 'admin.template.html',
    providers: [ AdminService ]
})
export class AdminViewComponent {

    constructor(private adminService : AdminService) {
        //console.log(adminService.getUsers())
    }

}
