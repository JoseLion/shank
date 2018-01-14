// Angular modules:
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Core modules:
import {
    InputTextModule,
    ProgressSpinnerModule,
    GrowlModule,
    DataTableModule,
    SharedModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    DropdownModule
} from 'primeng/primeng';

import { ROUTES } from 'app/app.routes';
// import { Angular2SocialLoginModule } from "angular2-social-login";
import { FacebookModule } from 'ngx-facebook';

// App components:
import { InviteLoginViewComponent } from './login.component';
import { InviteRegisterViewComponent } from './register.component';

@NgModule({
    declarations: [
        InviteLoginViewComponent,
        InviteRegisterViewComponent
    ],
    imports: [
        // Core:
        BrowserModule,
        RouterModule.forRoot(ROUTES),
        FormsModule,
        BrowserAnimationsModule,

        // PrimeNG:
        InputTextModule,
        ProgressSpinnerModule,
        GrowlModule,
        DataTableModule,
        SharedModule,
        ButtonModule,
        TooltipModule,
        DialogModule,
        DropdownModule,

        // FB api:
        // Angular2SocialLoginModule
        FacebookModule.forRoot()

    ]
})
export class InviteViewModule { }

// Angular2SocialLoginModule.loadProvidersScripts({
//     'facebook': {
//       'clientId': '520526514985916',
//       'apiVersion': 'v2.11'
//     }
// });
