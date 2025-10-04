const express = require('express');

// Import middleware
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000', 'http://localhost:8080'],
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


// -------- utilities --------
const ymd = d => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));

async function getJson(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.json();
}

const latestHistoricalDateUTC = () => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return utcHour < 7 ? new Date(todayUTC.getTime() - 86400000) : todayUTC;
};


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

app.get('/api/parks-list', async (req, res) => {
    try {
        const response = await fetch('https://storage.googleapis.com/national-park-conditions-dev/parks_master.json');

        if (!response.ok) {
            throw new Error(`GCS fetch failed: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Error fetching parks list:', err.message);
        res.status(500).json({ error: 'Failed to load park list' });
    }
});

app.get('/api/current-conditions-parks', async (req, res) => {
    const url = 'https://storage.googleapis.com/national-park-conditions-dev/current/latest.json';

    try {
        // HEAD request to get metadata
        const headResponse = await fetch(url, { method: 'HEAD' });

        if (!headResponse.ok) {
            console.error(`HEAD request failed: ${headResponse.status}`);
            return res.status(headResponse.status).send({ error: 'Failed to get metadata.' });
        }

        const lastModifiedRaw = headResponse.headers.get('Last-Modified');
        const lastModified = lastModifiedRaw
            ? new Date(lastModifiedRaw).toLocaleString('en-US', {
                timeZone: 'America/Los_Angeles',
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            }) + ' PT'
            : 'Unknown';

        // GET request to fetch actual data
        const dataResponse = await fetch(url);

        if (!dataResponse.ok) {
            const text = await dataResponse.text();
            console.error(`GET failed:\n${text}`);
            return res.status(dataResponse.status).send({ error: 'Failed to fetch park data.' });
        }

        const data = await dataResponse.json();

        res.json({
            lastUpdated: lastModified,
            data,
        });
    } catch (error) {
        console.error('Fetch error:', error.message);
        res.status(500).send({ error: 'Internal server error.' });
    }
});




// GET /api/park-history?parks=acad,arch
app.get('/api/park-conditions-detailed', async (req, res) => {
    const parkCodes = (req.query.parks || '').split(',').map(p => p.trim().toLowerCase());
    if (!parkCodes.length || !parkCodes[0]) {
        return res.status(400).json({ error: 'Missing park code(s)' });
    }

    const listUrl = `https://storage.googleapis.com/storage/v1/b/national-park-conditions-dev/o?prefix=forecast/&delimiter=/`;

    try {
        // Step 1: List forecast subfolders
        const listRes = await fetch(listUrl);
        const listJson = await listRes.json();
        const prefixes = listJson.prefixes || [];

        // Step 2: Get latest timestamp folder (sorted descending)
        const latestFolder = prefixes
            .map(p => p.replace('forecast/', '').replace('/', ''))
            .filter(Boolean)
            .sort()
            .reverse()[0];

        if (!latestFolder) {
            return res.status(404).json({ error: 'No forecast folders found' });
        }

        const results = [];

        for (const code of parkCodes) {
            const fileName = `${code}_${latestFolder}.json`;
            const fileUrl = `https://storage.googleapis.com/national-park-conditions-dev/forecast/${latestFolder}/${fileName}`;

            const response = await fetch(fileUrl);
            if (!response.ok) {
                console.warn(`File not found: ${fileUrl}`);
                continue;
            }

            const raw = await response.json();

            // Shared metadata
            const meta = {
                fullName: raw.fullName,
                parkCode: raw.parkCode,
                elevation: raw.elevation
            };

            // Daily data format
            const data = raw.forecast.forecastday.map(day => {
                const date = day.date;
                const groupedHourly = {
                    [date]: day.hour.map(hour => ({
                        datetime: hour.time,
                        temp: hour.temp_f,
                        precip: hour.precip_in,
                        cloud: hour.cloud,
                        condition: hour.condition?.text || ''
                    }))
                };

                return {
                    day: {
                        date,
                        ...day.day
                    },
                    hourly: groupedHourly
                };
            });

            results.push({
                park: code,
                meta,
                data
            });
        }

        res.json({ parks: parkCodes, timestamp: latestFolder, data: results });
    } catch (error) {
        console.error('Error fetching park forecast:', error.message);
        res.status(500).json({ error: 'Failed to load park forecast' });
    }
});
// -------- 3) history (hourly, windowed, normalized) --------
app.get('/api/park-conditions-history', async (req, res) => {
    const parks = (req.query.parks || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);

    if (!parks.length) return res.status(400).json({ error: 'parks required' });

    // clamp: don't include the new UTC day until after 07:00Z (00:00 PT)
    const latestHistoricalDateUTC = () => {
        const now = new Date();
        const todayUTC = new Date(Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()
        ));
        return now.getUTCHours() < 7 ? new Date(todayUTC.getTime() - 86400000) : todayUTC;
    };

    const ymd = d => d.toISOString().slice(0, 10);
    const addDays = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));

    const requestedEnd = req.query.end ? new Date(req.query.end + 'T00:00:00Z') : new Date();
    const hardEnd = latestHistoricalDateUTC();
    const end = requestedEnd > hardEnd ? hardEnd : requestedEnd;

    const days = Math.max(1, Math.min(31, parseInt(req.query.days || '5', 10)));
    const BUCKET = 'https://storage.googleapis.com/national-park-conditions-dev';

    async function getJson(url) {
        const r = await fetch(url, { cache: 'no-store' });
        if (!r.ok) return null;
        try { return await r.json(); } catch { return null; }
    }

    // --- Flexible extractors ---------------------------------------------------
    const arrayishKeys = ['hours', 'hourly', 'hour', 'data', 'observations', 'obs', 'entries', 'points'];

    function looksLikeHour(o) {
        if (!o || typeof o !== 'object') return false;
        return !!(o.time || o.datetime || typeof o.epoch === 'number' || o.ts);
    }

    function extractArrayFrom(obj) {
        if (!obj || typeof obj !== 'object') return [];
        // 1) exact array
        if (Array.isArray(obj)) return obj;

        // 2) common nested keys
        for (const k of arrayishKeys) {
            const v = obj[k];
            if (Array.isArray(v)) return v;
            if (v && typeof v === 'object') {
                const vals = Object.values(v);
                if (vals.length && vals.every(x => typeof x === 'object')) return vals;
            }
        }

        // 3) object that itself is a time->record map
        const vals = Object.values(obj);
        if (vals.length && vals.every(looksLikeHour)) return vals;

        // 4) metadata object (name/state/lat/...) -> no hours
        return [];
    }

    function normalizeHour(h) {
        if (!h || typeof h !== 'object') return null;

        const time =
            h.time ||
            h.datetime ||
            (typeof h.epoch === 'number' ? new Date(h.epoch * 1000).toISOString() : null) ||
            h.ts || null;

        const tempF =
            h.temp_f ?? h.tempF ?? h.temperature_f ?? h.temperatureF ?? h.temp ?? null;

        const precipIn =
            h.precip_in ?? h.precipIn ?? h.precip_inches ?? h.precip ?? 0;

        const cloud = h.cloud ?? h.cloudCover ?? 0;
        const windMph = h.wind_mph ?? h.windMph ?? h.windSpeed_mph ?? h.wind ?? null;
        const humidityPct = h.humidity ?? h.humidityPct ?? null;

        return time ? { time, tempF, precipIn, cloud, windMph, humidityPct } : null;
    }

    function normalizeDayPayload(payload) {
        const arr = extractArrayFrom(payload);
        return arr.map(normalizeHour).filter(Boolean);
    }
    // ---------------------------------------------------------------------------

    try {
        const data = [];

        for (const park of parks) {
            const hourly = {};
            const dateList = Array.from({ length: days }, (_, i) => ymd(addDays(end, -i)));

            await Promise.all(
                dateList.map(async d => {
                    const url = `${BUCKET}/historical/${park}/${d}.json`;
                    const json = await getJson(url);
                    if (!json) return;

                    const normalized = normalizeDayPayload(json);

                    // Always set the date key; empty arrays are OK and easier to reason about
                    hourly[d] = normalized;
                })
            );

            data.push({ park, hourly });
        }

        res.set('Cache-Control', 'no-store');
        res.set('X-Normalized', '1'); // 👈 quick sanity header
        res.json({ data });
    } catch (e) {
        console.error('[history] error', e);
        res.status(500).json({ error: String(e) });
    }
});


// -------- 4) forecast (hourly for ~3 days) --------
app.get('/api/park-conditions-forecast', async (req, res) => {
  const parks = (req.query.parks || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  if (!parks.length) return res.status(400).json({ error: 'parks required' });

  try {
    // Step 1: list forecast subfolders
    const listUrl = `https://storage.googleapis.com/storage/v1/b/national-park-conditions-dev/o?prefix=forecast/&delimiter=/`;
    const listRes = await fetch(listUrl);
    const listJson = await listRes.json();
    const prefixes = listJson.prefixes || [];

    // Step 2: pick the most recent timestamp
    const latestFolder = prefixes
      .map(p => p.replace('forecast/', '').replace('/', ''))
      .filter(Boolean)
      .sort()
      .reverse()[0];

    if (!latestFolder) {
      return res.status(404).json({ error: 'No forecast folders found' });
    }

    const results = [];

    // Step 3: fetch each requested park’s file
    for (const park of parks) {
      const fileName = `${park}_${latestFolder}.json`;
      const fileUrl = `https://storage.googleapis.com/national-park-conditions-dev/forecast/${latestFolder}/${fileName}`;

      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          console.warn(`Forecast file not found: ${fileUrl}`);
          continue;
        }

        const raw = await response.json();

        // Normalize hourly rows
        const hourly = raw.forecast.forecastday.flatMap(day =>
          day.hour.map(h => ({
            datetime: h.time,
            temp: h.temp_f,
            precip: h.precip_in,
            cloud: h.cloud,
            condition: h.condition?.text || '',
          }))
        );

        results.push({
          park,
          fullName: raw.fullName,
          parkCode: raw.parkCode,
          elevation: raw.elevation,
          hourly,
          daily: raw.forecast.forecastday.map(d => ({
            date: d.date,
            max: d.day.maxtemp_f,
            min: d.day.mintemp_f,
            condition: d.day.condition?.text || '',
          })),
        });
      } catch (e) {
        console.error(`Error fetching forecast for ${park}:`, e);
      }
    }

    res.set('Cache-Control', 'public, max-age=600'); // cache 10 min
    res.json({ folder: latestFolder, data: results });
  } catch (e) {
    res.status(500).json({ error: String(e) });
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