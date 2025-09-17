# Mock Data Replacement Guide

## Current Mock Data Issues Found

### 1. Admin Dashboard (AdminDashboardPage.tsx)
- ✅ **FIXED**: Statistics now use real API from `/admin/dashboard/overview`
- ❌ **TODO**: Charts still use hardcoded data arrays
- ❌ **TODO**: Recent activities are hardcoded

### 2. Users Management (UsersPage.tsx) 
- ❌ **TODO**: Uses `usersData` from `__users.json`
- ❌ **TODO**: `generateMockUsers()` function needs replacement
- 🔄 **IN PROGRESS**: Started API integration with `adminApi.getUsers()`

### 3. Hotel Management (HotelPage.tsx)
- ❌ **TODO**: Uses `homeStayData` from `__homeStay.json`
- ❌ **TODO**: `generateHotelsFromJson()` function needs replacement
- ❌ **TODO**: Replace with `adminApi.getHotels()`

### 4. Bookings Management (BookingsPage.tsx)
- ❌ **TODO**: Uses both `homeStayData` and `usersData` JSON files
- ❌ **TODO**: `generateMockBookings()` function needs replacement
- ❌ **TODO**: Replace with `adminApi.getBookings()`

### 5. Client-Side Pages
- ❌ **TODO**: `StayPage.tsx` uses `DEMO_STAY_LISTINGS`
- ❌ **TODO**: `StayDetail.tsx` uses `DEMO_STAY_LISTINGS`
- ❌ **TODO**: `useAuthStore.ts` uses `users.json` for authentication

### 6. Mock Data Files to Remove
```
src/data/jsons/__homeStay.json
src/data/jsons/__users.json
src/data/jsons/__authors.json
src/data/listings.ts (DEMO_STAY_LISTINGS)
src/data/authors.ts (DEMO_AUTHORS)
src/data/categories.ts (DEMO_STAY_CATEGORIES)
```

## Replacement Strategy

### Phase 1: Complete Admin Panel API Integration
1. **Fix UsersPage.tsx**
   - Replace `usersData` import with `adminApi.getUsers()`
   - Update TypeScript interfaces
   - Add loading states
   - Implement CRUD operations with real API

2. **Fix HotelPage.tsx**
   - Replace `homeStayData` import with `adminApi.getHotels()`
   - Update hotel data structure to match backend
   - Implement hotel management operations

3. **Fix BookingsPage.tsx**
   - Replace mock booking generation with `adminApi.getBookings()`
   - Update booking data structure
   - Implement booking management operations

4. **Complete Dashboard Integration**
   - Replace hardcoded chart data with real analytics
   - Use `adminApi.getRevenueAnalytics()`, `adminApi.getDashboardBookingAnalytics()` etc.
   - Replace recent activities with real data

### Phase 2: Client-Side Integration
1. **Create Client API Service**
   - Create `src/api/client.ts` for public endpoints
   - Implement hotel listing, search, booking APIs
   - Replace demo data in client pages

2. **Update Authentication**
   - Replace JSON-based auth with real API in `useAuthStore.ts`
   - Integrate with Laravel authentication system

### Phase 3: Cleanup
1. Remove all JSON mock data files
2. Remove demo data constants
3. Update imports across the project
4. Add proper error handling and loading states

## Immediate Actions Needed

### 1. Fix Current TypeScript Errors
The UsersPage and HotelPage have interface mismatches that need fixing:

```typescript
// Update AdminUser interface in api/admin.ts
export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
    email_verified_at?: string | null;
    profile_pic?: string | null;
    nickname?: string | null;
    dob?: string | null;
    phone?: string | null;
    gender?: string | null;
    address?: string | null;
}
```

### 2. Backend API Verification
Ensure all admin endpoints are working:
- ✅ `/admin/dashboard/overview` - Working
- ❓ `/admin/users` - Need to test
- ❓ `/admin/hotels` - Need to test  
- ❓ `/admin/bookings` - Need to test

### 3. Priority Order
1. **HIGH**: Fix TypeScript errors in partially updated files
2. **HIGH**: Complete UsersPage API integration
3. **MEDIUM**: Update HotelPage and BookingsPage
4. **MEDIUM**: Complete Dashboard charts
5. **LOW**: Client-side pages (can work with mock data temporarily)

## Testing Strategy
1. Test each admin page individually after API integration
2. Verify CRUD operations work correctly
3. Check loading states and error handling
4. Ensure data persistence across page refreshes