import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {AppComponent} from "./app";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {ROUTES} from "./app.routes";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

// App views
import {LoginViewModule} from '../views/login/login.module';
import {AdminViewModule} from '../views/users/admin/admin.module';
import {PublicViewModule} from '../views/users/public/public.module';
import {SettingsViewModule} from '../views/settings/settings.module';

// App modules/components
import {NavigationModule} from "../views/common/navigation/navigation.module";
import {FooterModule} from "../views/common/footer/footer.module";
import {TopnavbarModule} from "../views/common/topnavbar/topnavbar.module";

@NgModule({
    declarations: [AppComponent],
    imports     : [

        // Angular modules
        BrowserModule,
        HttpModule,

        // Views
        LoginViewModule,
        AdminViewModule,
        PublicViewModule,
        SettingsViewModule,

        // Modules
        NavigationModule,
        FooterModule,
        TopnavbarModule,

        RouterModule.forRoot(ROUTES)
    ],
    providers   : [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap   : [AppComponent]
})

export class AppModule {}
