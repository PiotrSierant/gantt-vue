const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
    // origin: 'http://localhost:8081' // Pozwól na połączenia z portu 8081
    origin: 'http://localhost:5173' // Pozwól na połączenia z portu 
}));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'gantt'
});

db.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych: ' + err.stack);
        return;
    }
    console.log('Połączono z bazą danych jako ID ' + db.threadId);
});

/* Tworzenie procesu */
app.post('/api/process', (req, res) => {
    const { name, data, user_id } = req.body;
    const sql = 'INSERT INTO process (name, data, user_id) VALUES (?, ?, ?)';
    db.query(sql, [name, data, user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        return res.status(201).json({
            id: results.insertId,
            name,
            data,
            user_id
        });
    });
});
/* Pobieranie procesu o id */
app.get('/api/process/:id', (req, res) => {
    const id = req.params.id; 

    const sql = `
        SELECT process.*, users.name AS user_name, users.last_name AS user_last_name, users.phone AS user_phone
        FROM process
        LEFT JOIN users ON process.user_id = users.id
        WHERE process.id = ?;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(200).json({ message: 'Nie znaleziono wpisu o podanym ID' });
        }
        return res.json(results[0]); 
    });
});
/* Edytowanie procesu o id */
app.put('/api/process/:id', (req, res) => {
    const id = req.params.id; 
    const { name, data, user_id } = req.body; 

    const sql = 'UPDATE process SET name = ?, data = ?, user_id = ? WHERE id = ?';
    db.query(sql, [name, data, user_id, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Rekord nie został znaleziony.' });
        }

        return res.json({ id, name, data, user_id });
    });
});

/* Edytowanie procesu o id */
app.put('/api/process-user/:id', (req, res) => {
    const id = req.params.id;
    const { user_id } = req.body;

    const sql = 'UPDATE process SET user_id = ? WHERE id = ?';
    db.query(sql, [user_id, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Rekord nie został znaleziony.' });
        }

        return res.json({ id, user_id }); 
    });
});

/* Usuwanie procesu o id */
app.delete('/api/process/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM process WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Rekord nie został znaleziony.' });
        }

        return res.json({ message: 'Rekord został usunięty.' });
    });
});
/* Pobieranie listy procesów */
app.get('/api/process-list', (req, res) => {
    const sql = 'SELECT id, name FROM process;';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});
/* Pobieranie listy procesów z userami */
app.get('/api/process-list-with-users', (req, res) => {
    const sql = 'SELECT p.id AS process_id, p.name AS process_name, u.id AS user_id, u.name AS user_name, u.last_name AS user_last_name FROM process p LEFT JOIN users u ON p.user_id = u.id;';
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        // Przetwórz wyniki, aby zagnieździć dane użytkownika w obiekcie "user"
        const formattedResults = results.map(item => {
            const user = item.user_id
                ? {
                    id: item.user_id,
                    full_name: `${item.user_name} ${item.user_last_name}`,
                }
                : null;

            return {
                process_id: item.process_id,
                process_name: item.process_name,
                user: user,
            };
        });

        res.json(formattedResults);
    });
});

/* Pobranie userów z procesami */
app.get('/api/users', (req, res) => {
    const getUsersWithProcessesSql = `
        SELECT u.id AS user_id, u.name, u.last_name, u.phone, p.id AS process_id, p.name AS process_name FROM users u LEFT JOIN process up ON u.id = up.user_id LEFT JOIN process p ON up.id = p.id;
    `;

    db.query(getUsersWithProcessesSql, (err, rows) => {
        if (err) return res.status(500).json({ error: err });

        const usersMap = {};
        rows.forEach(row => {
            if (!usersMap[row.user_id]) {
                usersMap[row.user_id] = {
                    id: row.user_id,
                    name: row.name,
                    last_name: row.last_name,
                    phone: row.phone,
                    process: []
                };
            }

            if (row.process_id) {
                usersMap[row.user_id].process.push({
                    id: row.process_id,
                    name: row.process_name
                });
            }
        });

        const users = Object.values(usersMap);
        res.status(200).json(users);
    });
});
/* Pobranie usera po id */
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        res.json(results[0]);
    });
});
/* Pobranie listy userów z polem full name */
app.get('/api/users-list', (req, res) => {
    const sql = 'SELECT id, CONCAT(name, " ", last_name) AS full_name FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

/* Dodawanie usera */
app.post('/api/users', (req, res) => {
    const { name, last_name, phone } = req.body;

    // Wstawianie użytkownika do bazy danych
    const sql = 'INSERT INTO users (name, last_name, phone) VALUES (?, ?, ?)';
    db.query(sql, [name, last_name, phone], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        // Po wstawieniu, pobierz dane nowego użytkownika
        const userId = result.insertId;
        const getUserSql = 'SELECT id, name, last_name, phone FROM users WHERE id = ?';

        db.query(getUserSql, [userId], (err, rows) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ message: 'Użytkownik dodany', user: rows[0] });
        });
    });
});

/* Edytowanie usera */
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, last_name, phone } = req.body;
    const sql = 'UPDATE users SET name = ?, last_name = ?, phone = ? WHERE id = ?';
    db.query(sql, [name, last_name, phone, id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        res.json({ message: 'Użytkownik zaktualizowany' });
    });
});

/* Usuwanie usera */
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        res.json({ message: 'Użytkownik usunięty' });
    });
});

/* Pobieranie listy procesów z userami */
app.get('/api/dashboard-zegary', (req, res) => {
    const sql = `
        SELECT 
            process.*, 
            users.name AS user_name, 
            users.last_name AS user_last_name, 
            users.phone AS user_phone 
        FROM process
        JOIN users ON process.user_id = users.id
    `;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });


        const formattedResults = results.map(process => {
            return {
                id: process.id,
                name: process.name,
                data: process.data,
                user: {
                    id: process.user_id,
                    name: process.user_name,
                    last_name: process.user_last_name,
                    phone: process.user_phone,
                },
            };
        });

        res.json(formattedResults);
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});