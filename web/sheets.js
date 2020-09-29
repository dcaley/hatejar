foo();

function foo() {
    console.log("start");

    const fs = require('fs');
    const readline = require('readline');
    //const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
    const TOKEN_PATH = 'token.json';

    const content =
    {
        "type": "service_account",
        "client_email": "gsheets@hate-jar.iam.gserviceaccount.com",
        "client_id": "106866209565881053420",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDv1cfXm+xsWOD7\nz1WkhhAQ253YZZO8Ypn1lWtTtZVwjkyNPB4NBSkTYTlXrNcLC1Ddc48XTBH8VXx3\nbeBK5Zk7Yxfx894Gh6nOmx/CpoEcP0Hdc/WbRbGza4XxSIGGZ3h6utsPM+4Dp+jH\na3RagmHgPWqDXkXaCV+Z+7FJBzdMFf/ZJ0eQbCCQ2oqrWHvnRDMCAxEQFvNCNAZZ\np3K0Nw4huZhkKvILk7nw2NT1cXNI3MaWL9MEbJHtDaQsls91Mm4NUeXKY8Hkby3h\nG5UdWVDFFlfEXFbad89sJjawsnMh/bIsdgajvk6ZlsvqrvTk18qXfpT/ptBN0N5o\n7zr2RxQRAgMBAAECggEABXdkMCJEuvhDoQZ0ne1clOoMho/cQ1zx1SAOUg1yq3NI\nLtsbhdYMaGyJqvukDce4pZWh49JyTn+AkljRkaNyT9ibBWDhba6KKoiO3bGQxnJP\ndAFeVslkRXls+qXzN2o3ysRS+7swvXb93lDszZX52R6zouzAFLGbVSa+P5CHvXTW\nAzIUis/XIbcLb/385QJAShj17shrFycyZ7wwBPNWSLE4Ri1WKvbs+O+wcEj3LbL/\nltifIAZ0H6aKuRuRdEgoqm21wUxwIsIFM/P3a3JxLh6gCIlUUhkUrSd3HYXgeWgm\nqO6nMAC9zJGYgD4cLSKyAy/VpO+cZlqEVHbbc92/SQKBgQD4YBBZfDZQ6ClaUord\nm08j7QIiBnnYhP+O/yw+S+XPIXVDOZWM2KMMGk19ILPr4g9dKJL2RKkPhK2M5Fa/\nR9iIAzhWNKSlEgcbf0B6ZCJthDhKSeLPxzatBH38qNxPMCy0L/T368J9E3RLWBQn\na3aGBA8v10yY8Pyexoh6Uc2OMwKBgQD3Mpnjb/ueiXKKHF6MKj0Lr6C/pI1QMUjb\nQiJ+UXw5E93iyTyDp0r/Qc7Qphbape6q8iKo8v/VXKcpgkPIc11NCudfFQoRyRot\n7Bwb2jBzUv+vnO3UXTYlvyEhhmAXrp5dnXKGzXnOphHpcNz/sWAiXYKVrObXTZFE\n81Gs3dqIqwKBgAR9sC3+CfliiUTh0zL4mPC8W1qEJXXdycUrJgCmXKxnHXiutN6M\nGD6ixx3pFnfAaai0kBu12By4uG6gvlTNFsQ20rD0WLnHXquHnIHaB6lVR7NILLq3\nDm0IdMK5xuoDo/tKFrLY53ZdgK/QEuU3kzgPILsruG3XhanVSyhzDDVzAoGADLE/\nb4sfa0t5YxgDzsSYb9IructUKirtp7xkkwHSFAguG2fjwIrFcgfJ+7Kbd8yPTZ2z\nI+OeOTFRr/LtUgyCXONTb/Ffm/wsaPE3nEJ+vF0lnbm8CGxkzFlc9SC2LGEd5oag\nC8XfHDowr0DJSCOuYPVWMCM5kxJ7hAPOTMbzYpMCgYAfnGTmGrVg7I1DxI9HUzQH\nTP93qNAMVMQMrysthChyLAGqAU+8WZgr9cr3Z0/VU3BsBPTipYlwQFUD2q0Kelop\nUJYE0sgcrjQXsKf6z99gEem/Nn7rFcJyB4FWEr7Y6p3QSVzO229T280D707WDa7j\n7YJMZkM6IseAsZFJDiZosg==\n-----END PRIVATE KEY-----\n"
    }


// Load client secrets from a local file.
    //fs.readFile('credentials.json', (err, content) => {
    //    if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(content, listMajors);
    //});

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    /**
     * Prints the names and majors of students in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */
    function listMajors(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({
            spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
            range: 'Class Data!A2:E',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length) {
                console.log('Name, Major:');
                // Print columns A and E, which correspond to indices 0 and 4.
                rows.map((row) => {
                    console.log(`${row[0]}, ${row[4]}`);
                });
            } else {
                console.log('No data found.');
            }
        });
    }

    console.log("end");
}
