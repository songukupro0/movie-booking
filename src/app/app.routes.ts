import { Routes } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';

export const routes: Routes = [

{
path: '',
component: MainLayoutComponent,
children: [

{
path: '',
loadChildren: () => import('./features/home/home-module').then(m => m.HomeModule)
},


{
path: 'movies',
loadChildren: () => import('./features/movies/movies-routing-module').then(m => m.MoviesRoutingModule)
},
{
path: 'category',
loadChildren: () => import('./features/category/category-routing.module').then(m => m.CategoryRoutingModule)
},
{
path: 'cinemas',
loadChildren: () => import('./features/cinemas/cinemas-module').then(m => m.CinemasModule)
},
{
path: 'showtimes',
loadChildren: () => import('./features/showtimes/showtimes-module').then(m => m.ShowtimesModule)
},
{
path: 'booking',
loadChildren: () => import('./features/booking/booking-module').then(m => m.BookingModule)
},
{
path: 'payment',
loadChildren: () => import('./features/payment/payment-module').then(m => m.PaymentModule)
},
{
path: 'profile',
loadChildren: () => import('./features/profile/profile-module').then(m => m.ProfileModule)
},
{
path: 'search',
loadChildren: () => import('./features/search/search-module').then(m => m.SearchModule)
},
{
path: 'reviews',
loadChildren: () => import('./features/reviews/reviews-module').then(m => m.ReviewsModule)
},
{
path: 'promotions',
loadChildren: () => import('./features/promotions/promotions-module').then(m => m.PromotionsModule)
}
]
},

// ==========================================
// 2. AUTH LAYOUT (Đăng nhập, Đăng ký)
// Giao diện trống (không Header/Footer)
// ==========================================
{
path: 'auth',
component: AuthLayoutComponent,
children: [
{
path: '',
loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
}
]
},

// ==========================================
// 3. ADMIN LAYOUT (Quản trị viên)
// Giao diện có Sidebar, Admin Header riêng
// ==========================================
{
path: 'admin',
component: AdminLayoutComponent,
// Bạn có thể thêm AuthGuard ở đây sau này để bảo vệ route Admin
// canActivate: [adminGuard],
children: [
{
path: '',
loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
}
]
},

// ==========================================
// 4. WILDCARD ROUTE (Bắt lỗi 404)
// Điều hướng về trang chủ nếu nhập sai link
// ==========================================
{
path: '**',
redirectTo: '',
pathMatch: 'full'
}
];