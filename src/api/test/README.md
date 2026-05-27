# API Tests with Hurl

This directory contains API tests using [Hurl](https://hurl.dev), a command line tool that runs HTTP requests defined in a simple plain text format.

## Installation

Install Hurl using one of these methods:

### macOS
```bash
brew install hurl
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install hurl
```

### Other systems
See [Hurl installation guide](https://hurl.dev/docs/installation.html) for more options.

## Running Tests

To run a single test file:
```bash
hurl src/api/test/auth.hurl
```

To run all test files:
```bash
hurl src/api/test/*.hurl
```

To run tests in test mode (ideal for CI/CD):
```bash
hurl --test src/api/test/*.hurl
```

## Test Structure

Each .hurl file contains one or more HTTP requests with optional assertions:

```hurl
# Simple GET request
GET https://example.org
HTTP 200

# POST request with JSON payload and assertions
POST https://example.org/api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

HTTP 201
[Asserts]
jsonpath "$.id" exists
jsonpath "$.name" == "John Doe"
```

## Writing New Tests

1. Create a new `.hurl` file in this directory
2. Define your HTTP requests and assertions
3. Run the tests to verify they work correctly

For more information about Hurl syntax, see the [Hurl documentation](https://hurl.dev/docs/).