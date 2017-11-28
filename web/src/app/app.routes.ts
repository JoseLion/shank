import {Routes} from "@angular/router";
import {LoginViewComponent} from '../views/login/login.component';
import {AdminViewComponent} from '../views/users/admin/admin.component';
import {PublicViewComponent} from '../views/users/public/public.component';
import {SettingsViewComponent} from '../views/settings/settings.component';

export const ROUTES:Routes = [
    // Main redirect
    {path: '', redirectTo: 'users/admin', pathMatch: 'full'},

    // App views
    {path: 'users/admin', component: AdminViewComponent},
    {path: 'users/public', component: PublicViewComponent},
    {path: 'settings', component: SettingsViewComponent},

    // Handle all other routes
    {path: 'login', component: LoginViewComponent, useAsDefault: true}
    //{path: '**',    component: mainViewComponent }
];
