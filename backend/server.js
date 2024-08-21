const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const cors = require('cors');
app.use(cors());


app.use(express.json());

// Example route
app.get('/api/greet', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
