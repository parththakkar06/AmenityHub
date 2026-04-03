import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { HomeComponent } from './components/home/home.component';
import { MybookingsComponent } from './components/mybookings/mybookings.component';
import { BookAmenityComponent } from './components/book-amenity/book-amenity.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddAmenityComponent } from './components/add-amenity/add-amenity.component';
import { ViewAmenitiesComponent } from './components/view-amenities/view-amenities.component';
import { AdminBookingComponent } from './components/admin-booking/admin-booking.component';
import { RegisteredUsersComponent } from './components/registered-users/registered-users.component';
import { RevenueByAmenityComponent } from './components/revenue-by-amenity/revenue-by-amenity.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'verifyotp',
        component: VerifyComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'mybookings',
        component: MybookingsComponent
    },
    {
        path: 'book-amenity',
        component: BookAmenityComponent
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'dashboard/add-amenity',
        component: AddAmenityComponent
    },
    {
        path: 'dashboard/view-amenities',
        component: ViewAmenitiesComponent
    },
    {
        path: 'dashboard/bookings',
        component: AdminBookingComponent
    },
    {
        path: 'dashboard/registered-users',
        component: RegisteredUsersComponent
    },
    {
        path: 'dashboard/revenuebyamenity',
        component: RevenueByAmenityComponent
    }
];
