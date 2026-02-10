# Security Notice

## Known Vulnerabilities

### cashfree-pg Dependency (Axios DoS Vulnerability)

**Status:** Known Issue - Development Only  
**Severity:** High  
**CVE:** [GHSA-43fc-jf86-j433](https://github.com/advisories/GHSA-43fc-jf86-j433)

#### Description
The `cashfree-pg` payment gateway SDK (v5.1.0) depends on an older version of `axios` (≤1.13.4) that contains a Denial of Service vulnerability via the `__proto__` key in `mergeConfig`.

#### Impact
An attacker could potentially exploit this vulnerability to cause a denial of service by sending specially crafted requests that manipulate the prototype chain.

#### Current Mitigation
1. **Development Only**: This codebase is currently for C-DAC challenge demonstration purposes
2. **Input Validation**: All payment endpoints implement strict input validation
3. **Controlled Environment**: Payment flows are tested in controlled environments only

#### Production Deployment Checklist
Before deploying to production, **one of the following must be completed**:

- [ ] Wait for `cashfree-pg` to update their axios dependency
- [ ] Switch to an alternative payment gateway (Razorpay, Stripe, PayU)
- [ ] Fork and patch `cashfree-pg` with updated axios dependency
- [ ] Implement additional runtime protection against prototype pollution

#### Monitoring
- **Last Checked:** February 10, 2026
- **Next Review:** Check for cashfree-pg updates before production deployment

---

## Reporting Security Issues

If you discover a security vulnerability, please email the development team immediately. Do not create public issues for security vulnerabilities.

## Security Best Practices Implemented

- ✅ JWT-based authentication
- ✅ Environment variable protection for secrets
- ✅ CORS configuration
- ✅ Input validation on all endpoints
- ✅ Prepared statements for SQL queries (SQL injection prevention)
- ✅ Rate limiting on authentication endpoints
- ⚠️ **Known issue with cashfree-pg axios dependency** (documented above)
