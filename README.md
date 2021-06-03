# VCL-documentation-web-app-server
Asynchronous documentation web-app built by a subset of Correlation. Features a timeline to document tribal knowledge within our teams.
## Contributor Setup
1. Run `npm install`.
2. Create a file named `.env` in the root directory and copy the following:

```
ATLAS_URI=mongodb+srv://<username>:<password>@vcl-documentation-app.gcjzz.mongodb.net/VCL-Documentation-App?retryWrites=true&w=majority
```
3. Please replace `<username>` and `<password>` with your username and password from your database user from MongoDB.

To create a database user, navigate to the project "Documentation Web-app" on MongoDB. Then navigate to the "Database Access" tab, and click "Add new database user". 

Note to not use a password that you would normally use with other apps.

4. To start the app locally, run `node index.js` in the root directory. Feel free to use nodemon as well :)
