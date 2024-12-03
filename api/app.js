const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const processRoutes = require('./routes/process.route');
const dashboardRoutes = require('./routes/dashboard.route');
const subprocessRoutes = require('./routes/subprocess.route');
const processUsersRoutes = require('./routes/processUsers.route');
const processGroupRoutes = require('./routes/processGroup.route');

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/process-users', processUsersRoutes);
app.use('/api/process-groups', processGroupRoutes);
app.use('/api/process', processRoutes);
app.use('/api/subprocess', subprocessRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });

    return;
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});