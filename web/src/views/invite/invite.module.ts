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
import { FacebookModule } from 'ngx-facebook';

// App components:
import { InviteViewComponent } from './invite.component';

@NgModule({
    declarations: [
        InviteViewComponent
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
        FacebookModule.forRoot()

    ]
})
export class InviteViewModule { }
