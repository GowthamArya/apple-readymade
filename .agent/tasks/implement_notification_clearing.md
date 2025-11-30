# Task: Implement Notification Clearing

## Status: Completed

## Objective
Allow users to clear notifications from the notification popup, which should also delete them from the database to save space.

## Changes Implemented

### 1. API Endpoint
- **File:** `app/api/notifications/route.ts`
- **Change:** Added a `DELETE` method.
- **Logic:**
    - Accepts `id` in the request body.
    - Verifies the user is authenticated.
    - Deletes the notification from the `notifications` table where `id` matches AND (`user_email` is null OR `user_email` matches the current user).
    - This ensures users can delete their own notifications and broadcast notifications (which deletes them for everyone, per the "save db space" requirement).

### 2. Header Component
- **File:** `app/components/Header.tsx`
- **Change:**
    - Imported `DeleteOutlined` icon.
    - Added `handleDelete` function in `NotifPopover` to call the DELETE API.
    - Added a delete button (trash icon) to each notification item in the list.
    - The delete button stops propagation to prevent triggering the notification click action.
    - On successful deletion, the notification is removed from the local state immediately.

## Verification
- Users should see a delete icon next to each notification.
- Clicking the icon should remove the notification from the list.
- The notification should be permanently deleted from the database.
