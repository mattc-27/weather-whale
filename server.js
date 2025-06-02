const express = require('express');

// Import middleware
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:8080'],
    methods: 'GET, POST, PUT',
    allowedHeaders: 'Content-Type,Authorization'
};

// Create express app
const app = express();

// 🔥 Add this middleware early (before routes)
/*
app.use((req, res, next) => {
    if (req.path.endsWith('.php') || req.path.includes('.php')) {
        console.log('path contains php')
        return res.status(403).send('Forbidden');
    }
    next();
});
*/

// Implement middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser())

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


app.use(express.static(path.join(__dirname, 'dist')));


app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/*
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});*/

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const IQAIR_API_KEY = process.env.IQAIR_API_KEY;

app.get(`/api/weather/:searchUrl`, async (req, res) => {
    const { searchUrl } = req.params;
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${searchUrl}&days=3&aqi=no&alerts=yes`)
        const data = await response.json()
        res.send(data)
        //  console.log(result);

    } catch (error) {
        console.error(error.message)
    }
});

app.get(`/api/list-park-history`, async (req, res) => {

    try {
        const response = await fetch('https://storage.googleapis.com/storage/v1/b/national-park-conditions/o')
        const data = await response.json();

        // The relevant array is in data.items
        const historyArr = data.items || [];

        // Extract filenames or other metadata if needed
        const allItems = historyArr
            .filter(item => item.name.endsWith('.json') && !item.name.includes('cors'))
            .map(item => {
                const match = item.name.match(/\d{4}-\d{2}-\d{2}/);
                const isLatest = item.name.includes('latest.json');

                return {
                    name: isLatest ? 'Current' : (match ? match[0] : item.name),
                    fullPath: item.name,
                    updated: item.updated,
                    size: item.size
                };
            });

      //  console.log(allItems);
        res.json(allItems);
    } catch (error) {
        console.error('Error fetching park history:', error.message);
        res.status(500).json({ error: 'Failed to fetch park history' });
    }
})

app.get(`/api/park-weather`, async (req, res) => {
    const path = req.query.path || 'weather/latest.json';
    const url = `https://storage.googleapis.com/national-park-conditions/${path}`;
    try {
        // HEAD request to get metadata
        const headResponse = await fetch(url, { method: 'HEAD' });
        const lastModifiedRaw = headResponse.headers.get('Last-Modified');

        // Format to Pacific Time
        const lastModified = new Date(lastModifiedRaw).toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        // GET request to fetch data
        const dataResponse = await fetch(url);
        const data = await dataResponse.json();

        res.send({
            lastUpdated: `${lastModified} PT`,
            data: data
        });
    } catch (error) {
        console.error(error.message)
    }
});



app.get(`/api/air-quality`, async (req, res) => {
    const { lat, lon } = req.query;
    try {
        const response = await fetch(`http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${IQAIR_API_KEY}`);
        const data = await response.json();
        res.send(data)
        console.log(data)
    } catch (error) {
        console.error(error.message)
    }
});



///
app.get(`/api/current`, async (req, res) => {
    // const { query } = 'Denver'
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=2957b6bebdac477e89c204130240101&q=Denver`)
        const data = await response.json()
        // res.send(data)
        console.log(data);

    } catch (error) {
        console.error(error.message)
    }
});



/// 
app.get('/api/backend_test/', async (req, res) => {
    try {
        res.send(JSON.stringify({ Express: 'Back end is connected' }));
    } catch (error) {
        console.error(error.message);
    }
});


// Setup default port
app.set('port', process.env.PORT || 8080);

// Start express app
app.listen(app.get('port'), () => {
    console.log(`Server running at port: ${app.get('port')}`)
});