import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http, RequestOptions } from "@angular/http";
import { ROUTES } from "./app.routes";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { EmitterService } from '../views/core/emitter.service';
import { Rest } from '../views/core/rest';
import { AuthGuard } from '../views/core/AuthGuard';
import { SweetAlert } from 'views/core/sweetAlert';
import { MessageService } from 'primeng/components/common/messageservice';

// App views
import { MainViewModule } from '../views/main.module';
import { LoginViewModule } from '../views/login/login.module';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig(), http, options);
}

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
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        EmitterService,
        Rest,
        AuthGuard,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [ Http, RequestOptions ]
        },
        JwtHelper,
        SweetAlert,
        MessageService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
