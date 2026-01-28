# 🚑 FIX: CloudFront "Access Denied" (403) on Refresh

This error happens because CloudFront doesn't know how to handle Angular routes like `/home` or `/portal`. It looks for a folder, doesn't find it, and stops.

### 🛠️ Mandatory AWS Configuration

To fix the XML error, you MUST add **Custom Error Responses** in your CloudFront Distribution.

1.  **Open AWS Console** and go to **CloudFront**.
2.  Click on your **Distribution ID** (the one hosting your frontend).
3.  Go to the **"Error pages"** tab.
4.  Click **"Create custom error response"**.
5.  **Add Error #1**:
    *   **HTTP error code**: `403: Forbidden` (S3 gives this when it can't find a path).
    *   **Customize error response**: Yes.
    *   **Response page path**: `/index.html`
    *   **HTTP response code**: `200: OK`
6.  **Add Error #2**:
    *   **HTTP error code**: `404: Not Found`.
    *   **Customize error response**: Yes.
    *   **Response page path**: `/index.html`
    *   **HTTP response code**: `200: OK`
7.  **Click Save/Create**.

### 🔄 Why this works:
When you refresh on `client4.ecbee.net/home`, CloudFront gets a 403 error. With this fix, it will catch that error, serve your `index.html` instead, and Angular will then correctly load the `/home` page.

### 🚨 Note on Caching:
After you save these settings, it may take 5-10 minutes for AWS to update the network globally.
