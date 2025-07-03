[Back](../../README.md)

# CustomerService

This service is responsible for handling operations related to customers. It includes the following methods:

## Method: allInOne

This method creates a new datasource, customer, and user all in one go. It takes an object as an argument which includes properties of `Customer`, `DatasourceSource`, `User` and an additional property `userApiKey`.

**Parameters:**

- `data`: An object that includes properties of `Customer`, `DatasourceSource`, `User` and `userApiKey`.

**Returns:**

- An object containing the newly created `customer`, `datasource`, and `user`.

## Method: register

This method registers a new customer and creates a new user associated with that customer. It takes an object as an argument which includes properties for customer registration.

**Parameters:**

- `obj`: An object that includes properties for customer registration.

**Returns:**

- The newly created `customer`.

## Method: upsert

This method updates an existing customer or inserts a new one if it doesn't exist. It takes an object as an argument which includes properties of `Customer`.

**Parameters:**

- `obj`: An object that includes properties of `Customer`.

**Returns:**

- The updated or newly created `customer`.

Note: The method also handles the association of datasources with the customer if `datasources` property is present in the `obj`.

Please note that this is a high-level overview of the service. For detailed implementation, refer to the source code.
