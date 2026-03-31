import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { HomeComponent } from './components/home/home.component';
import { MybookingsComponent } from './components/mybookings/mybookings.component';
import { BookAmenityComponent } from './components/book-amenity/book-amenity.component';

export const routes: Routes = [
    {
        path : 'login',
        component : LoginComponent
    },
    {
        path : 'register',
        component : RegisterComponent
    },
    {
        path : 'verifyotp',
        component : VerifyComponent
    },
    {
        path : 'home',
        component : HomeComponent
    },
    {
        path : 'mybookings',
        component : MybookingsComponent
    },
    {
        path : 'book-amenity',
        component : BookAmenityComponent
    }
];
