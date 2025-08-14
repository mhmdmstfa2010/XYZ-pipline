require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const planetSchema = new mongoose.Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
const planetModel = mongoose.model('planets', planetSchema);

const planets = [
    { id: 0, name: 'Sun', description: 'Center of the Solar System', image: '', velocity: '0 km/s', distance: '0 km' },
    { id: 1, name: 'Mercury', description: 'Closest to the Sun', image: '', velocity: '47.87 km/s', distance: '57.91 million km' },
    { id: 2, name: 'Venus', description: 'Second planet from the Sun', image: '', velocity: '35.02 km/s', distance: '108.2 million km' },
    { id: 3, name: 'Earth', description: 'Our home planet', image: '', velocity: '29.78 km/s', distance: '149.6 million km' },
    { id: 4, name: 'Mars', description: 'The Red Planet', image: '', velocity: '24.07 km/s', distance: '227.9 million km' },
    { id: 5, name: 'Jupiter', description: 'Largest planet', image: '', velocity: '13.07 km/s', distance: '778.5 million km' },
    { id: 6, name: 'Saturn', description: 'Ringed planet', image: '', velocity: '9.69 km/s', distance: '1.429 billion km' },
    { id: 7, name: 'Uranus', description: 'Ice giant', image: '', velocity: '6.81 km/s', distance: '2.871 billion km' },
    { id: 8, name: 'Neptune', description: 'Farthest planet', image: '', velocity: '5.43 km/s', distance: '4.351 billion km' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/solar-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        await planetModel.deleteMany({});
        await planetModel.insertMany(planets);
        console.log('Planets inserted');
        mongoose.connection.close();
    })
    .catch(err => console.error('Error:', err));