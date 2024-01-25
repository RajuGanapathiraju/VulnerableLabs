// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const mongoUri = 'mongodb://localhost:27017';
const dbName = 'invitations';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/add-person', async (req, res) => {
  const { customer, person } = req.body;

  try {
    const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const invitationsCollection = db.collection('invitations');

    // Check if the customer has already invited 3 people
    const invitation = await invitationsCollection.findOne({ customer });
    if (invitation && invitation.invitedPeople.length >= 3) {
      return res.status(400).json({ message: 'You can only invite 3 people.' });
    }

    // Add the person to the invited list
    await invitationsCollection.updateOne({ customer }, { $push: { invitedPeople: person } }, { upsert: true });

    res.json({ message: 'Person added successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
