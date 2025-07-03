[Back](../../README.md)

# User Service Documentation

This service is responsible for handling operations related to users. It includes the following methods:

## Method: createAdmin

This method creates a new user with the role of 'superadmin'.

**Parameters:**

- `adminEmail`: The email of the admin user.
- `adminKey`: The API key of the admin user.
- `adminCustomer`: The customer associated with the admin user.

**Returns:**

- The newly created `user`.

## Method: hasAccess

This method checks if the current user has access to a certain role.

**Parameters:**

- `targetRole`: The role to check access for.

**Returns:**

- A boolean indicating whether the user has access to the target role.

The method works as follows:

1. It checks the `targetRole` against the current user's role.
2. If the `targetRole` is 'SUPERADMIN', it checks if the user's role is 'SUPERADMIN'.
3. If the `targetRole` is 'ADMIN', it checks if the user's role is 'SUPERADMIN' or 'ADMIN'.
4. If the `targetRole` is 'USER', it returns true.
5. If the `targetRole` is not any of the above, it returns false.
6. If the user does not have access, it throws a `Forbidden` error.

Please note that this is a high-level overview of the service. For detailed implementation, refer to the source code.
