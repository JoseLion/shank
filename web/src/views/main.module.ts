// Angular modules:
import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
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
    DropdownModule,
    CalendarModule
} from 'primeng/primeng';

import { ROUTES } from "app/app.routes";

// App modules:
import { ReportsModule } from './reports/reports.module';

// App components:
import { NavigationComponent } from "views/common/navigation";
import { FooterComponent } from "views/common/footer";
import { TopnavbarComponent } from "views/common/topnavbar";

import { MainViewComponent } from "views/main.component";
import { UserViewComponent } from "views/users-profiles/user.component";
import { ProfileViewComponent } from "views/users-profiles/profile.component";
import { TournamentsViewComponent } from 'views/golfApi/tournaments.component';
import { PlayersViewComponent } from 'views/golfApi/players.component';
import { SettingsViewComponent } from "views/settings/settings.component";

@NgModule({
    declarations: [
        FooterComponent,
        NavigationComponent,
        TopnavbarComponent,

        MainViewComponent,
        UserViewComponent,
        ProfileViewComponent,
        TournamentsViewComponent,
        PlayersViewComponent,
        SettingsViewComponent
    ],
    imports: [
        // Core:
        BrowserModule,
        RouterModule.forRoot(ROUTES),
        FormsModule,
        BrowserAnimationsModule,

        // PrimeNG
        InputTextModule,
        ProgressSpinnerModule,
        GrowlModule,
        DataTableModule,
        SharedModule,
        ButtonModule,
        TooltipModule,
        DialogModule,
        DropdownModule,
        CalendarModule,

        // Modules:
        ReportsModule

    ]
})
export class MainViewModule { }
