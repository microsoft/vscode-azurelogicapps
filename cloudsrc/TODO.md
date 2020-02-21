# TODO

## REDIRECT URL (AZURE PORTAL)

https://ema.hosting,portal.azure.net/ema/Content/{versionNumber}/Html/authredirect.html?pid={pid}&trustedAuthority={trustedAuthority}&code={code}

- https://ema.hosting,portal.azure.net = Hosting service authority (depends on environment selector)
- {versionNumber} = Azure portal extension version number, e.g., 1.41216.1.4.200106-1403
- {pid} = ID of popup (differentiates between multiple auth popups).
- {trustedAuthority} = Trusted authority (depends on environment selector), e.g., https%3a%2f%2fms.portal.azure.com
- {code} = Consent server code (must be confirmed by designer), e.g., 5320aba81bd94092b2b7ae95f03bbd8e

## AUTHORIZATION

1. Start HTTP server to listen to requests from authdirect.html.
2. Open popup with vscode.env.openExternal when an URL is passed to the OAuth popup instance from the connection service.
3. Wait for HTTP requests.

- LoginCancelled
  - Posted when the user closes the popup
  - Resolve loginPromise with error set to "The user has closed the popup."
- LoginComplete
  - Posted when the user is redirected after successful authorization
  - Resolve loginPromise with code set to consent server code.
- LoginTimeout
  - Posted when the designer times out waiting 300 seconds for a successful authorization
  - Resolve loginPromise with error set to "The popup has timed out."

## QUESTIONS

How does the designer pick which connection to use if there are existing connections?
