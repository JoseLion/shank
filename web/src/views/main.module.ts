import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MainViewComponent } from "./main.component";
import { ROUTES } from "../app/app.routes";

// App views
import {AdminViewModule} from './users/admin/admin.module';
import {PublicViewModule} from './users/public/public.module';
import {SettingsViewModule} from './settings/settings.module';
import {ProfileViewModule} from './profiles/profile.module';

// App modules/components
import {NavigationModule} from "./common/navigation/navigation.module";
import {FooterModule} from "./common/footer/footer.module";
import {TopnavbarModule} from "./common/topnavbar/topnavbar.module";

@NgModule({
    declarations: [
        MainViewComponent
    ],
    imports: [
        // Views
        AdminViewModule,
        PublicViewModule,
        SettingsViewModule,
        ProfileViewModule,

        // Modules
        NavigationModule,
        FooterModule,
        TopnavbarModule,

        RouterModule.forRoot(ROUTES)
    ]
})
export class MainViewModule { }
