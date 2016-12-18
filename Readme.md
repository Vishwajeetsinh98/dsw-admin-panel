# DSW-ADMIN-PANEL

- Schema
- Routes

## Schema

- Event
- User
- [Gist For Events Data](https://gist.github.com/Vishwajeetsinh98/cc5d27bb3f5151cfde071d590c9b5a5f)  

### Event

### User

TODO: Roles

##Authorization
Authorization is done by email/password method. All the respective users will be provided a password and the email to be used will be the email provided by VIT.

## Routes

Full Url ex. `/role/route`

Roles: 
- fc : Faculty Coordinators
- admin: DSW, superAdmin, clubAdmin, chapterAdmin
-chapter: Various clubs and chapters

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
|   GET     |     /           |                 {}                          |   Render Events List                 |     None             |      An HTML View to see all the events in a tabulated manner and filters to sort events |     fc, admins, chapters |
|   GET     |     /list       |                 {}                          |   {data: [,,.{Event Details}], success: true}       |     {data: [], success: false} |  API To get events list  |  fc, admins, chapter |
|   GET     |     /all        |                 {}                          |   {data: [,,.{Event Details}], success: true} |   {data: [], success: false} |  Get All the events entered in the dB      |      fc, admins  |
|   GET     |     /:eventId   |                 {eventId: URL Parameter}    |   Render Event Page                  |    None             |     View Details of a particular event    |     fc, admins   | 

###FC Routes

Eg. ```fc/routes```  

Allowed Roles: ['fc']  

| HTTP Verb | Route           | Request Format                              | Success Response                     | Failure Response  | | Comments | Access         |
|-----------|-----------------|---------------------------------------------|--------------------------------------|----------------------|----------|----------------|
|  POST     |   /accept       |       {body: {eventId: String, accept: Boolean}} |   Redirect to Home with succes message | Redirect to Home with failure Message | The Faculty Coordinator will approve the event and then, the event will be sent to DSW and superAdmin |  FC | 


###DSW Routes

Eg. ```dsw/routes```
Allowed Roles: ['dsw', 'superAdmin']

| HTTP Verb | Route           | Request Format                              | Success Response                     | Failure Response     | Comments | Access         |
|-----------|-----------------|---------------------------------------------|--------------------------------------|----------------------|----------|----------------|
|   POST    |     /approve    |    {eventFor: String, accept: Boolean}      |    Redirect to Home with related message   |   Redirect to Home with failure Message |  The DSW has the first right to approve or reject. Upon approval, the event is forwarded to the respective admins | dsw, superAdmin | 
|   POST    |     /forward    |    {eventId: String, role: String}                        |    Redirect to Home                  |      Redirect to home with failure message    |  To forward the event without approving or rejecting it   | dsw, superAdmin |
|   POST    |     /approveoverall | {eventFor: String, accept: Boolean}     |    Redirect to Home with related message |  Redirect to Home with error message |  To directly approve or reject an event without consulting the admins  |    dsw, superAdmin | 
|   POST    |     /editevent  |     {body: {eventFor: String, length: Number, changes: [,,.{changeField: String, changeValue: String}]}}  | Redirect to Home with related message | Redirect to home with error message  |  To edit the details of event. | dsw, superAdmin | 


###Admin Routes

Eg. ```admin/routes```
Allowed Roles: ['clubAdmin', 'chapterAdmin']

| HTTP Verb | Route           | Request Format                              | Success Response                     | Failure Response     | Comments | Access         |
|-----------|-----------------|---------------------------------------------|--------------------------------------|----------------------|----------|----------------|
|   POST    |     /approve    |    {eventFor: String, accept: Boolean}      |    Redirect to Home with related message   |   Redirect to Home with failure Message |  The event is approved or rejected finally, because the DSW has already approved. | clubAdmin, chapterAdmin | 
|   POST    |     /forward    |    {eventId: String, role: String}                        |    Redirect to Home                  |      Redirect to home with failure message    |  To forward the event without approving or rejecting it   | clubAdmin, chapterAdmin |
|   POST    |     /editevent  |     {body: {eventFor: String, length: Number, changes: [,,.{changeField: String, changeValue: String}]}}  | Redirect to Home with related message | Redirect to home with error message  |  To edit the details of event. The event is then resent to DSW to get it's permission for the updated details. | clubAdmin, chapterAdmin | 

###Status Codes
- 401 Authentication Failed. Invalid Credentials
- 403 Unauthorized. Current user type can't access the route
- 500 Internal Error
