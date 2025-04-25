import { Routes } from '@angular/router';
import { WorkComponent } from './pages/work/work.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        pathMatch: 'full',
        component: WorkComponent
    },
    {
        path: 'about-me',
        pathMatch: 'full',
        component: AboutMeComponent
    }
];
