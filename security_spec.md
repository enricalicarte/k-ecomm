# Security Specification

## Data Invariants
- A user must be an admin to edit content within `blog`, `carousels`, `cms`, `brands`, `products`, `users`, and to view `analytics`.
- `analytics` can be created by anyone (publicly).
- No standard user registration exists. Only allowed admins (enricalicarte@gmail.com, merchefernandezlorente@gmail.com) can be admins.

## The "Dirty Dozen" Payloads
1. Create a `products` document as a non-admin.
2. Update a `products` document as a non-admin.
3. Create a `brands` document as a non-admin.
4. Update a `brands` document as a non-admin.
5. Create a `blog` document as a non-admin.
6. Create a `carousels` document as a non-admin.
7. Update `cms/homepage` as a non-admin.
8. Update `cms/settings` as a non-admin.
9. Create `analytics` with missing fields.
10. Update `analytics` as an admin (should be append-only?).
11. Update another user's `role` to admin.
12. Read `analytics` as a non-admin.
