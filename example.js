import * as alt from 'alt';
import Wrapper from './DataBase.mjs'; // Import Wrapper
import { User } from './models/exampleSchema.js'; //  Register Schema User

// Must be in this specific order.
// 1 - CallBack Open Connection
// 2 - CallBack Error Connection 
const DataBase = new Wrapper(
    console.log("Good"), console.log('Error')
);

// This is an event called when the DataBase is connected.
// You don't need to use this; but it helps understand the current state of the db connection.
alt.on('ConnectionComplete', () => {
    // Update or Insert a new document.
    DataBase.upsertData(User, 'Account', result => {
        // Fetch data by field name, field value, and repo name.
        DataBase.fetchData('username', 'DiTheRX', 'Account', res => {
            if (res === undefined) {
                console.log('This user was not found.');
                return;
            }

            console.log(res);
        });

        // Fetch a document by ID.
        DataBase.fetchByIds(1, 'Account', res => {
            if (res === undefined) {
                console.log('The document with the id was not found.');
                return;
            }

            console.log('Fetched Document for ID: ' + res[0].id);
            console.log(res[0]);

            // The result is going to be an array if it finds the document.
            // If you're expecting 1 result. Then use call [0] on res.
            console.log('Attempting to Update Data...');
            DataBase.updatePartialData(
                res[0].id,
                { username: 'NewUsername' },
                'Account',
                res => {
                    // Will return an object if successfull.
                    if (typeof res !== 'object') {
                        console.log('Failed to find and update document.');
                        return;
                    }

                    console.log('Updated Successfully');
                }
            );
        });

        // Returns an array of all documents with all data.
        // If no documents exist; it'll be undefined.
        DataBase.fetchAllData('Account', res => {
            console.log('Fetched all documents for table ACCOUNT');
            console.log(res);
        });

        // Selects all data and returns just usernames.
        DataBase.selectData('Account', ['username'], res => {
            console.log('Selected by USERNAME');
            console.log(res);
        });

        // Delete by ID
        setTimeout(() => {
            DataBase.deleteByIds(1, 'Account', res => {
                console.log('Deleted ID 1');
                console.log(res);
            });
        }, 5000);
    });
});