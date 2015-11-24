# solid-signup
[![](https://img.shields.io/badge/project-Solid-7C4DFF.svg?style=flat-square)](https://github.com/solid/solid)

> WebID signup application for Solid servers.

## App configuration
In order to use the signup app, you must first configure it to point to a server on which the accounts will be created. You can specify the server by edititing the configuration area in `app.js`. For example, the following constants can be set there:

```
var DOMAIN = 'https://databox.me';
var ACCOUNT_ENDPOINT = ',system/newAccount';
var CERT_ENDPOINT = ',system/newCert';
```

The value of `DOMAIN` sets the base URL for the new accounts, where new accounts will be subdomains -- i.e. `https://alice.databox.me`.

The value of `DOMAIN` can also be overridden without editing the `app.js` file, by adding a URL query parameter called `domain` when loading the app. For example, to override the default domain of the signup app and point to `https://example.org`, a user can click on the following link:

`https://solid.github.io/solid-signup/?domain=https%3A%2F%2Fexample.org`

The `ACCOUNT_ENDPOINT` and `CERT_ENDPOINT` values will be appended to the final URI of the user's new account. If your server does not use ACCOUNT_ENDPOINT or CERT_ENDPOINT paths, please set them to an empty value.

## App workflow

1. If the user wants to use `alice` to sign up, the app will check if the account `https://alice.databox.me/` exists. It checks this by doing an HTTP GET on `https://alice.databox.me/`, using the value of `DOMAIN` to create the URL. If an `HTTP 404` status is returned, the app will prompt the user to create that account.

2. If the user proceeds with the account creation, an HTTP POST request will be sent to the account URL, while also appending the `ACCOUNT_ENDPOINT` value. In this case, the resulting URL will be `https://alice.databox.me/,system/newAccount`. The POST request will look like a regular form submission -- i.e. it will have the Content-Type header set to `application/x-www-form-urlencoded`. The form will also send the following values:

	* `email` - used for recovery purposes
	* `username` [optional] - used to specifiy the account name (for servers that do not use sub-domains)

3. Once the account is created, the user is given the option to add her name to her profile and also to upload a profile picture.

4. Finally, the user will be able to obtain a client certificate, that will be bound to her WebID profile.
