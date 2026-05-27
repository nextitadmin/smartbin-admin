# Test base API endpoint
# This endpoint returns HTML content

GET https://smartbin-be.next-itservices.com/api
HTTP 200
[Asserts]
header "Content-Type" contains "text/html"
body contains "<html"
body contains "</html>"