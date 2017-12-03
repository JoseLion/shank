import { Routes } from "@angular/router";
import { MainViewComponent } from '../views/main.component';
import { LoginViewComponent } from '../views/login/login.component';
import { UserViewComponent } from '../views/users/user.component';
import { ProfileViewComponent } from '../views/profiles/profile.component';
import { SettingsViewComponent } from '../views/settings/settings.component';

export const ROUTES:Routes = [
    // Main redirect
    {path: '', redirectTo: 'shank', pathMatch: 'full'},

    // App views
    {
        path: 'shank',
        component: MainViewComponent,
        children: [
            {path: 'usersProfiles/users/:profile', component: UserViewComponent},
            {path: 'usersProfiles/profiles', component: ProfileViewComponent},
            {path: 'settings', component: SettingsViewComponent}
        ]
    },
    {path: 'login', component: LoginViewComponent }
];
