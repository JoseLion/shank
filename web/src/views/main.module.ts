import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MainViewComponent } from "./main.component";
import { ROUTES } from "../app/app.routes";

// App views
import { UserViewModule } from './users/user.module';
import { ProfileViewModule } from './profiles/profile.module';
import { SettingsViewModule } from './settings/settings.module';

// App modules/components
import { NavigationModule } from "./common/navigation/navigation.module";
import { FooterModule } from "./common/footer/footer.module";
import { TopnavbarModule } from "./common/topnavbar/topnavbar.module";

@NgModule({
    declarations: [
        MainViewComponent
    ],
    imports: [
        // Views
        UserViewModule,
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
