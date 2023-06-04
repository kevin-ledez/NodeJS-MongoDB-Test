const express = require('express');
const app = express();
const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/myapp';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

const personSchema = new mongoose.Schema({
    name: String,
});

const Person = mongoose.model('Person', personSchema);

app.use(express.urlencoded({ extended: false }));

app.post('/', (req, res) => {
    const name = req.body.name;

    const person = new Person({ name });
    person.save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.error('Error saving person', err);
            res.redirect('/');
        });
    });

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    Person.find()
        .then((people) => {
            res.render('index', { people });
        })
        .catch((err) => {
            console.error('Error fetching people', err);
            res.render('index', { people: [] });
        });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});