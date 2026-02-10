import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Get the auth token from localStorage
    const token = localStorage.getItem('token');

    // Clone the request and add the authorization header if token exists
    if (token) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedRequest);
    }

    // If no token, proceed with the original request
    return next(req);
};
