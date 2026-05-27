# Test user management endpoints

# Get all users (requires authentication)
GET https://smartbin-admin-backend-production.up.railway.app/api/v1/users
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$" isCollection
jsonpath "$" count > 0

# Get a specific user
GET https://smartbin-admin-backend-production.up.railway.app/api/v1/users/1
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$.id" == 1
jsonpath "$.name" exists

# Create a new user
POST https://smartbin-admin-backend-production.up.railway.app/api/v1/users
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user"
}

HTTP 201
[Asserts]
jsonpath "$.id" exists
jsonpath "$.name" == "Jane Doe"

# Update a user
PUT https://smartbin-admin-backend-production.up.railway.app/api/v1/users/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "admin"
}

HTTP 200
[Asserts]
jsonpath "$.id" == 1
jsonpath "$.name" == "Jane Smith"

# Delete a user
DELETE https://smartbin-admin-backend-production.up.railway.app/api/v1/users/1
Authorization: Bearer {{token}}
HTTP 204