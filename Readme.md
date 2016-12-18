# riviera-api

- Schema
- Routes

## Schema

- Event
- User
- [Gist For Events Data](https://gist.github.com/Vishwajeetsinh98/45b21ef070f95e0b2c5f013a74af3e0d)  

### Event

### User

TODO: Roles

## Routes

Full Url ex. `/role/route`

###Index Routes

Eg. ```/route```

| HTTP Verb | Route           | Request Format                              | Success Response                     | Failure Response     | Comments | Access         |
|-----------|-----------------|---------------------------------------------|--------------------------------------|----------------------|----------|----------------|
|   GET     |       /         |                  {}                         |    Render Events Form                |    None              | Form To Submit Events | Public |
|   POST    |      /addevent  |  {body: {Events Schema Items}}              |    Event Successfully Saved          |    Error Details     | Save the event and Forward to FA for approval | Public |
|   GET     |      /login     |                  {}                         |    Render Login Form                 |    None              | Form To Login to the Portal | Public |
|   POST    |      /login     |  {body: {email: String, password: String}}  |    Redirect To Home Page             |    User Not Found or Incorrect Password | For the admins of the chapters to login | Public |
|   GET     |      /home      |                  {}                         |    Render Home Page                  |    Not Logged In, Redirect to login | Display the home page along with the options for each user type | fc, admins, chapters |
|   GET     |      /logout    |                  {}                         |    Redirect to Login Page            |    Not Logged In     |          |   fc, admins, chapters | 

###Events Routes

Eg. ```events/route```

| HTTP Verb | Route           | Request Format                              | Success Response                     | Failure Response     | Comments | Access         |
|-----------|-----------------|---------------------------------------------|--------------------------------------|----------------------|----------|----------------|
