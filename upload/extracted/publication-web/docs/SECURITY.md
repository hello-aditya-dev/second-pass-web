# Security Foundation

## Present

- no runtime secrets required
- security headers
- strict TypeScript
- no arbitrary HTML rendering
- no forms writing to a backend yet
- no auth
- no database
- no third-party scripts

## When integrations arrive

### Newsletter
- server-side validation
- provider key server-only
- abuse/rate controls
- generic error responses

### CMS
- read token server-only if private
- webhook secret validation
- preview mode protected

### Ads/analytics
- review CSP/header impact
- minimize third-party execution
- implement consent where legally/provider required

## Dependency rule

Patch framework/security advisories promptly. Do not freeze old framework versions merely for
stability if a known security issue applies.
