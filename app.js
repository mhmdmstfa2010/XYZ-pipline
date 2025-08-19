require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

mongoose.set('strictQuery', true);

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/solar-system';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connection Successful'))
    .catch(err => console.error('MongoDB Connection Error:', err));

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
const planetModel = mongoose.model('planets', dataSchema);

app.post('/planet', async function (req, res) {
    try {
        const planetData = await planetModel.findOne({ id: req.body.id });
        if (!planetData) {
            return res.status(404).send('Planet not found. Select a number from 0 - 9');
        }
        res.send(planetData);
    } catch (err) {
        console.error('Error in planet query:', err);
        res.status(500).send('Error in Planet Data');
    }
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
    fs.readFile('oas.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.get('/os', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        os: OS.hostname(),
        env: process.env.NODE_ENV
    });
});

app.get('/live', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: 'live' });
});

app.get('/ready', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: 'ready' });
});

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, '0.0.0.0', () => {
        console.log('Server successfully running on port - 3000');
    });
}

module.exports = app;
// module.exports.handler = serverless(app);