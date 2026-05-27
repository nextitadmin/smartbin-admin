# Test account login verification endpoint

POST https://smartbin-admin-backend-production.up.railway.app/api/v1/accounts/login/verify
Content-Type: application/json

{
  "email": "{{email}}",
  "otp": "{{otp}}"
}
