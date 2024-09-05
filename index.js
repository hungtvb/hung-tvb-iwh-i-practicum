const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const petsUrl = 'https://api.hubspot.com/crm/v3/objects/pets?properties=pet_name,pet_bio,pet_age';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(petsUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const petData = {
        properties: {
            pet_name: req.body.pet_name,
            pet_bio: req.body.pet_bio,
            pet_age: req.body.pet_age
        }
    };

    const petsUrl = 'https://api.hubspot.com/crm/v3/objects/pets';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(petsUrl, petData, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating pet data');
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));