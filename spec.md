# Wishlist Store

## Current State

Full e-commerce storefront with 7 hardcoded products, Cash on Delivery checkout, and an admin dashboard at `/admin`. The admin system uses Internet Identity + a `claimFirstAdmin` flow. Orders are stored in a backend Map and retrieved via `getAllOrders`.

**The bug:** `AccessControl.getUserRole` calls `Runtime.trap("User is not registered")` for any principal not in the `userRoles` map. When a logged-in user calls `getAllOrders` (or any admin-gated endpoint), if their principal is not in the map (e.g. after a reset, or if `_initializeAccessControlWithSecret` hasn't run yet), the entire call traps — even if they successfully called `claimFirstAdmin`. This means orders never load in the admin dashboard.

Additionally, `_initializeAccessControlWithSecret` is called on every actor creation in the frontend. If `adminAssigned` is already `true` and the caller is already registered as admin, `AccessControl.initialize` silently skips (correct). But if the caller is not yet in the map AND `adminAssigned` is true, they get registered as `#user` — overwriting admin claims. The `claimFirstAdmin` directly sets `#admin` role but `_initializeAccessControlWithSecret` runs after and can reassign them to `#user`.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `AccessControl.getUserRole`: return `#guest` instead of `Runtime.trap` for unregistered principals — this makes all permission checks safe for any caller
- `AccessControl.initialize`: skip registration entirely if caller is already in the map (already does this via the switch, verify it's correct)
- `claimFirstAdmin`: after registering admin role, also set `accessControlState.adminAssigned := true` so subsequent `_initializeAccessControlWithSecret` calls don't overwrite the admin with `#user`
- `getAllOrders`: remains admin-only, but now safely returns Unauthorized error instead of trapping for unregistered callers
- Seed products: keep all 7 exactly as-is, do not modify

### Remove
- Nothing

## Implementation Plan

1. Fix `AccessControl.getUserRole` to return `#guest` for unregistered principals (no trap)
2. Fix `AccessControl.hasPermission` to safely handle guest/unregistered callers  
3. Ensure `claimFirstAdmin` sets `adminAssigned := true` (already does, keep it)
4. Ensure `_initializeAccessControlWithSecret` / `AccessControl.initialize` does NOT overwrite an existing role — the current switch already handles this (check null = register, ? = skip), which is correct
5. Keep all existing functionality: products, orders, placeOrder (public/anonymous), getAllOrders (admin), updateOrderStatus (admin), resetAdmin, claimFirstAdmin
6. Keep all 7 seed products loaded at startup with exact same IDs, names, prices, imageUrls
