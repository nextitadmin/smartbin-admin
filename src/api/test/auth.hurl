# Test authentication endpoints

# Test login endpoint
POST https://smartbin-be.next-itservices.com/api/v1/accounts/login
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}"
}
