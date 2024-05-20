### Requirements

    run npm i
    run npm start

### Env variables (using local Mongodb service)

    HOSTNAME
    APP_PORT

    DB_USERNAME
    DB_PASSWORD
    DB_PORT
    DB_NAME

    ACCESS_TOKEN_SECRET
    ACCESS_TOKEN_EXPIRES_IN

    REFRESH_TOKEN_SECRET
    REFRESH_TOKEN_EXPIRES_IN

    COOKIE_SECRET

## EndPints

-   POST    /api/v1/auth/register/  -> For regiset
-   POST    /api/v1/auth/login/     -> To login in.
-   GET     /api/v1/access/         -> Get a refresh token.
-   POST    /api/v1/auth/logout/    -> To log out.

