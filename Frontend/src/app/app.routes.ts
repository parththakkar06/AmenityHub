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
import { AmenityUtilizationComponent } from './components/amenity-utilization/amenity-utilization.component';
import { BookingTrendComponent } from './components/booking-trend/booking-trend.component';
import { userGuard } from './guards/user.guard';
import { isAdminGuard } from './guards/is-admin.guard';
import { isLoggedInGuard } from './guards/is-logged-in.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [isLoggedInGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate:[isLoggedInGuard]
    },
    {
        path: 'verifyotp',
        component: VerifyComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [userGuard]
    },
    {
        path: 'mybookings',
        component: MybookingsComponent,
        canActivate: [userGuard]
    },
    {
        path: 'book-amenity',
        component: BookAmenityComponent,
        canActivate: [userGuard]
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [userGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [userGuard,isAdminGuard]
    },
    {
        path: 'dashboard/add-amenity',
        component: AddAmenityComponent,
        canActivate: [userGuard,isAdminGuard]
    },
    {
        path: 'dashboard/view-amenities',
        component: ViewAmenitiesComponent,
        canActivate: [userGuard,isAdminGuard]
    },
    {
        path: 'dashboard/bookings',
        component: AdminBookingComponent,
        canActivate: [userGuard,isAdminGuard]
    },
    {
        path: 'dashboard/registered-users',
        component: RegisteredUsersComponent,
        canActivate: [userGuard,isAdminGuard]
    },
    {
        path: 'dashboard/revenuebyamenity',
        component: RevenueByAmenityComponent,
        canActivate: [userGuard,isAdminGuard]
    },
    {
        path: 'dashboard/amenitystat',
        component : AmenityUtilizationComponent,
        canActivate: [userGuard,isAdminGuard]
    },
    {
        path: 'dashboard/bookingtrends',
        component: BookingTrendComponent,
        canActivate: [userGuard,isAdminGuard]
    }
];
