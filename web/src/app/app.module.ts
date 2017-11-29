import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { ROUTES } from "./app.routes";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { EmitterService } from '../emitter.service';

// App views
import { MainViewModule } from '../views/main.module';
import { LoginViewModule } from '../views/login/login.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        // Angular modules
        BrowserModule,
        HttpModule,

        // Views
        MainViewModule,
        LoginViewModule,
        RouterModule.forRoot(ROUTES)
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        EmitterService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
