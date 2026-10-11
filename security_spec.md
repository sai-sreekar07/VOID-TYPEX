# Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Default-Deny Catch-All**: All unlisted paths are strictly denied (`allow read, write: if false;`).
2. **PII Split Isolation**: User email addresses are stored exclusively in `/users/{userId}/private/info` and are only readable/writable by the authenticated owner (`request.auth.uid == userId`).
3. **Identity Integrity**: Every write to `/users/{userId}` requires `incoming().uid == request.auth.uid` and `userId == request.auth.uid`. Every write to `/messages/{messageId}` requires `incoming().senderUid == request.auth.uid`.
4. **Immutable Fields**: `uid`, `role`, and `createdAt` on `/users/{userId}` cannot be mutated on update. `messages` documents are append-only (no update or delete).
5. **Temporal Integrity**: All `createdAt` fields must equal `request.time`.
6. **Strict Key & Size Enforcement**: Every string has explicit `.size()` bounds and regex validation where appropriate; `hasAll` and `hasOnly` prevent shadow fields.

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection on User Profile**: `{ uid: "u1", name: "Alice", role: "creator", ..., isAdmin: true }` -> Rejected by `hasOnly`.
2. **Cross-User Profile Spoofing**: Authenticated as `u1`, writing to `/users/u2` -> Rejected by `request.auth.uid == userId`.
3. **PII Leak Attempt**: Authenticated as `u2`, reading `/users/u1/private/info` -> Rejected by `request.auth.uid == userId`.
4. **Role Escalation Update**: Updating `role` from `"creator"` to `"brand"` on `/users/u1` -> Rejected by `affectedKeys().hasOnly(...)` excluding `role`.
5. **Timestamp Forgery**: Setting `createdAt` to a past timestamp instead of `request.time` -> Rejected by `incoming().createdAt == request.time`.
6. **Oversized String DoW Attack**: Sending a 50,000-character string in `text` on `/messages/{messageId}` -> Rejected by `data.text.size() <= 1000`.
7. **Invalid Path ID Injection**: Creating a document with special characters in ID -> Rejected by `isValidId()`.
8. **Message Sender Spoofing**: Authenticated as `u1`, creating a message with `senderUid: "u2"` -> Rejected by `incoming().senderUid == request.auth.uid`.
9. **Unauthorized Message Listing**: Listing `/messages` without filtering `resource.data.senderUid == request.auth.uid` -> Rejected by `allow list` query enforcer.
10. **Message Mutation Attack**: Attempting to update an existing chat message -> Rejected by `allow update: if false`.
11. **Unverified Email Write**: Attempting to write with `email_verified == false` on non-anonymous provider -> Rejected by `isVerifiedUser()`.
12. **Orphan Private Profile Creation**: Creating `/users/u1/private/info` without parent `/users/u1` existing -> Rejected by `existsAfter(/databases/$(database)/documents/users/$(userId))`.
