import { Routes } from "@angular/router";
import { MainViewComponent } from '../views/main.component';
import { LoginViewComponent } from '../views/login/login.component';
import { DashboardComponent } from 'views/reports/dashboard/dashboard.component';
import { UserViewComponent } from 'views/users-profiles/user.component';
import { ProfileViewComponent } from 'views/users-profiles/profile.component';
import { SettingsViewComponent } from '../views/settings/settings.component';
import { InviteLoginViewComponent } from '../views/invite/login.component';
import { InviteRegisterViewComponent } from '../views/invite/register.component';

export const ROUTES:Routes = [
    // Main redirect
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // App views
    {
        path: 'shank',
        component: MainViewComponent,
        children: [
            { path: 'reports/dashboard', component: DashboardComponent },
            { path: 'usersProfiles/users/:profile', component: UserViewComponent },
            { path: 'usersProfiles/profiles', component: ProfileViewComponent },
            { path: 'settings', component: SettingsViewComponent }
        ]
    },
    { path: 'login', component: LoginViewComponent },
    { path: 'invite/login/:groupToken', component: InviteLoginViewComponent },
    { path: 'invite/register/:groupToken', component: InviteRegisterViewComponent }
];
