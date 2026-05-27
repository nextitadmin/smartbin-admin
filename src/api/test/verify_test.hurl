# Test account login verification endpoint

POST https://smartbin-be.next-itservices.com/api/v1/accounts/login/verify
Content-Type: application/json

{
  "email": "{{email}}",
  "otp": "{{otp}}"
}