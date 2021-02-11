# vmsabeta

## Structure - 

  ### Home page - premise id/password
    - |__first login - starts with superuser
    - |__create adminstrator profile (username = adminstrator, profile = password created)
    - |__set up school profile (school name, emergency contact, manual or scan entry )
    - |__set up front desk profile vistor profile(username = front desk, password created) 

  ### Dashboard - *Login - check if admin/front desk to load dashboard profile*
   #### Administrator logs in
            - |__ add/remove ppl to black list
            - |__ edit admin/front desk profile 
            - |__ see block list (read only)
            - |__ see log (read only)

   #### front desk Logs in
            - |__ sees block list (read only)
            - |__ see log (read only)

  ### Vistor Station - checks id
      - |__check school profile for scan or manual entry
      - |__scan and convert info to send to database
          - |__OR manual entry and send to database (Start here first) 
      - |__send notification to front desk if black list
      - |__send log for dynamic table
      - |__send log for static table 
      - |__ confirmation modal to confirm print id
    
## Scope of Work - Web App that can perform the following tasks;

- Keep a database of visitors, blacklisted/restricted, and denied persons.
- multiple levels of management to include admin/secondary user.
- scan copy of an ID and attach to visitor database.
- take a photo and attach to the visitor database.
- print a temporary badge with expiration, name, and photo.

## Main Goals
 
- Login/Logout
- Form for submitting visitor info into database and ability to read, update, and delete (last name, first name, DOB)
- Form for submitting a Denied Person and ability to read, update, and delete  (last name, first name, DOB).
- Filterable list with the ability to search by last name, first name, DOB. maybe the option to display a list of people visited by date.
* this option isn't necessarily mentioned in scope, but the ability to view the list efficiently at any given time would dramatically increase the user experience. we should aim for this, in my opinion.*
- Admin can create users with strict permissions

### Stretch Goals

- secondary users can create/read a visitor record as well perform simpler operations such as checking visitors in, scanning ID's, etc.
- admin users can create, read, update, and delete as well as perform other operations that may require admin privileges.
