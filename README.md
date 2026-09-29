# Broken Access Control Demo Lab

## Overview
This is an educational Web Security Demo Lab designed to simulate a **Broken Access Control (BAC)** / **Improper Authorization** vulnerability at the API level. It demonstrates a common flaw where applications rely on Frontend (Client-side) Authorization to hide UI elements while failing to enforce Authorization on the Backend (Server-side) API.

## What is Broken Access Control?
Broken Access Control occurs when an application fails to properly enforce restrictions on what authenticated users are allowed to do. Attackers can exploit these flaws to access unauthorized functionality or data, such as accessing other users' accounts, viewing sensitive files, or modifying other users' data.

## Demo Scenario
In this scenario, a user with the role `USER` attempts to access the Admin Dashboard.
- The web page loads, displaying an empty "Loading..." table for a split second (700ms).
- In the background, the UI sends an API request to `GET /api/get-users/` to fetch admin data.
- **The UI Cover-up**: The frontend JavaScript completely ignores the response. After the 700ms delay, it hides the table and displays an "Access Denied" message because it knows the user is not an Admin.

While the UI looks secure (since no sensitive data was ever rendered on the screen), anyone intercepting the traffic (e.g., using Burp Suite) can clearly see the sensitive data in the API response.

## Vulnerable Endpoint
- **URL**: `/api/get-users/`
- **Method**: GET
- **Flaw**: The API does not verify if the requesting user has the `ADMIN` role. It blindly returns the sensitive JSON data to anyone who asks.

## Running the Lab

### Setup Instructions
1. Clone or download this repository.
2. Open a terminal and navigate to the project folder (`broken-access-control-lab`).
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

## How to capture the Request in Burp Suite
To demonstrate this vulnerability professionally:
1. Start **Burp Suite**.
2. Open the built-in Burp browser or configure your browser to use the Burp Proxy (usually `127.0.0.1:8080`).
3. Navigate to `http://localhost:3000` and launch the **Vulnerable Lab**.
4. In Burp Suite, go to the **Proxy > HTTP history** tab.
5. Look for the request to:
   `GET /api/get-users/ HTTP/1.1`
6. Look at the **Response** panel. You will clearly see the JSON containing sensitive data (Names, Emails, Roles) of 10-20 users, despite the UI saying "Access Denied".

## Why the behavior is insecure
Hiding elements via HTML/CSS/JS is a UX feature, not a security boundary. An attacker can simply bypass the browser UI entirely by issuing requests directly via Burp Suite, Postman, or `curl`.

## Fixed implementation
The fixed version uses the exact same endpoint path but sets a cookie (`version=fixed`) to demonstrate the correct server-side logic.
When you launch the **Fixed Lab**, the server verifies the user's role before querying the database. Since the user is `USER`, the server immediately responds with:
```http
HTTP/1.1 403 Forbidden
```
No sensitive data is ever transmitted over the network.

## Recommended remediation
1. **Never trust the client.** Hiding a UI element is not security.
2. **Enforce Authorization on the Backend.** Every API endpoint that returns sensitive data or performs sensitive actions must verify the user's identity (Authentication) and permissions (Authorization).
3. **Principle of Least Privilege.** Only return the specific records and fields the user needs.
