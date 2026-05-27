# Test authentication endpoints

# Test login endpoint
POST https://smartbin-admin-backend-production.up.railway.app/api/v1/accounts/login
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}"
}
