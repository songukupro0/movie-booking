# Implementation Plan - Fix Movie Showtimes Display

This plan addresses the issue where the "No showtimes available" message appears unexpectedly or inefficiently. We will optimize the fetching process and ensure correct date filtering.

## Proposed Changes

### Backend

#### [MODIFY] [home.controller.js](file:///d:/hoc%20ky%205/angular/movie-booking/backend/controllers/home.controller.js)
- Update [getMovieShowtimesByDate](file:///d:/hoc%20ky%205/angular/movie-booking/backend/controllers/home.controller.js#158-187) to robustly handle the date range regardless of server timezone.
- Ensure the response format matches what the frontend expects.

#### [MODIFY] [home.routes.js](file:///d:/hoc%20ky%205/angular/movie-booking/backend/routes/home.routes.js)
- Expose the [getMovieShowtimesByDate](file:///d:/hoc%20ky%205/angular/movie-booking/backend/controllers/home.controller.js#158-187) endpoint: `GET /api/home/movie-showtimes`.

---

### Frontend

#### [MODIFY] [home.service.ts](file:///d:/hoc%20ky%205/angular/movie-booking/src/app/core/services/home.service.ts)
- Add [getMovieShowtimes(movieId: string, date: string)](file:///d:/hoc%20ky%205/angular/movie-booking/backend/controllers/home.controller.js#158-187) method to call the new optimized endpoint.

#### [MODIFY] [movie-detail.ts](file:///d:/hoc%20ky%205/angular/movie-booking/src/app/features/movies/pages/movie-detail/movie-detail.ts)
- Replace the complex [loadShowtimes](file:///d:/hoc%20ky%205/angular/movie-booking/src/app/features/movies/pages/movie-detail/movie-detail.ts#111-171) logic (which used N+1 calls) with a single call to `homeService.getMovieShowtimes`.
- Update the [CinemaShow](file:///d:/hoc%20ky%205/angular/movie-booking/src/app/features/movies/pages/movie-detail/movie-detail.ts#15-20) and [Showtime](file:///d:/hoc%20ky%205/angular/movie-booking/src/app/features/movies/pages/movie-detail/movie-detail.ts#10-14) interfaces if necessary to match the new API response.

#### [MODIFY] [movie-detail.html](file:///d:/hoc%20ky%205/angular/movie-booking/src/app/features/movies/pages/movie-detail/movie-detail.html)
- Ensure the template correctly renders the data from the new optimized structure.
- Maintain the "No showtimes" message but ensure it only shows when the API returns no results.

## Verification Plan

### Automated Tests
- None currently exist for this specific flow. I will verify manually.

### Manual Verification
1. Navigate to a movie detail page.
2. Select different dates in the date tabs.
3. Verify that showtimes appear correctly for dates that have them.
4. Verify that the "Hiện không có suất chiếu nào..." message appear correctly only when a date has no showtimes.
5. Check the Network tab to ensure only one API call is made per date selection.
