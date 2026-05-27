# Test create account endpoint

POST https://smartbin-be.next-itservices.com/api/v1/accounts
Content-Type: application/json

{
  "name": "{{name}}",
  "email": "{{email}}",
  "phoneNumber": "{{phoneNumber}}",
  "role": "{{role}}"
}

HTTP 201
[Asserts]
jsonpath "$" exists