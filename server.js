const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

const selectionsFile = path.join(__dirname, 'dress_selections.txt');

// Initialize selections file if it doesn't exist
if (!fs.existsSync(selectionsFile)) {
    fs.writeFileSync(selectionsFile, 'Dress Selection Records\n' + '='.repeat(60) + '\n\n');
}

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to save dress selection
app.post('/api/save-dress', (req, res) => {
    try {
        const { dress, file, timestamp, compliment } = req.body;
        const entry = `
Dress: ${dress}
File: ${file}
Time: ${timestamp}
Compliment: ${compliment}
${'─'.repeat(60)}
`;
        fs.appendFileSync(selectionsFile, entry);
        res.json({ success: true, message: 'Selection saved' });
    } catch (err) {
        console.error('Error saving selection:', err);
        res.status(500).json({ error: 'Failed to save' });
    }
});

// Endpoint to view all selections
app.get('/view-selections', (req, res) => {
    try {
        const content = fs.readFileSync(selectionsFile, 'utf-8');
        res.send(`<pre style="font-family: monospace; padding: 20px; background: #f5f5f5;">${content}</pre>`);
    } catch (err) {
        res.status(500).send('Error reading selections');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
    console.log(`View selections at /view-selections`);
});
