import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { LoginViewComponent } from "./login.component";

import {
    InputTextModule,
    ProgressSpinnerModule,
    GrowlModule,
    ButtonModule
} from 'primeng/primeng';

@NgModule({
    declarations: [LoginViewComponent],
    imports     : [
        BrowserModule,
        FormsModule,

        // PrimeNG
        InputTextModule,
        ProgressSpinnerModule,
        GrowlModule,
        ButtonModule
    ]
})
export class LoginViewModule {}
