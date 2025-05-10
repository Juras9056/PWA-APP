// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // ← DODAJ TO!

const app = express();
app.use(cors()); // ← I TO!
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Błąd połączenia z MongoDB:'));
db.once('open', () => {
    console.log('Połączono z bazą danych MongoDB.');
});

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// NOWA ŚCIEŻKA - REJESTRACJA
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Użytkownik już istnieje.' });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'Utworzono nowego użytkownika.' });
    } catch (error) {
        console.error('Błąd podczas tworzenia użytkownika:', error);
        res.status(500).json({ message: 'Wystąpił błąd podczas tworzenia użytkownika.' });
    }
});

// NOWA ŚCIEŻKA - LOGOWANIE
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json({ message: 'Zalogowano pomyślnie!' });
        } else {
            res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
        }
    } catch (error) {
        console.error('Błąd logowania:', error);
        res.status(500).json({ message: 'Błąd serwera.' });
    }
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}.`);
});
