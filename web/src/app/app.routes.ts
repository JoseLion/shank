import {Routes} from "@angular/router";
import {MainViewComponent} from '../views/main.component';
import {LoginViewComponent} from '../views/login/login.component';
import {AdminViewComponent} from '../views/users/admin/admin.component';
import {PublicViewComponent} from '../views/users/public/public.component';
import {SettingsViewComponent} from '../views/settings/settings.component';
import {ProfileViewComponent} from '../views/profiles/profile.component';

export const ROUTES:Routes = [
    // Main redirect
    {path: '', redirectTo: 'shank', pathMatch: 'full'},

    // App views
    {
        path: 'shank',
        component: MainViewComponent,
        children: [
            {path: 'users/admin', component: AdminViewComponent},
            {path: 'users/public', component: PublicViewComponent},
            {path: 'settings', component: SettingsViewComponent},
            {path: 'profiles', component: ProfileViewComponent},
        ]
    },
    {path: 'login', component: LoginViewComponent }
];
