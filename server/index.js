const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let data = {
  dailyTasks: {},
  weeklyTasks: {},
  manicureTime: {}
};

app.get('/api/daily-tasks', (req, res) => res.json(data.dailyTasks));
app.post('/api/daily-tasks', (req, res) => {
  const { date, taskKey, completed } = req.body;
  data.dailyTasks[date] = { ...data.dailyTasks[date], [taskKey]: completed };
  res.sendStatus(200);
});

app.get('/api/weekly-tasks', (req, res) => res.json(data.weeklyTasks));
app.post('/api/weekly-tasks', (req, res) => {
  const { week, taskKey, completed } = req.body;
  data.weeklyTasks[week] = { ...data.weeklyTasks[week], [taskKey]: completed };
  res.sendStatus(200);
});

app.get('/api/manicure-time', (req, res) => res.json(data.manicureTime));
app.post('/api/manicure-time', (req, res) => {
  data.manicureTime = req.body;
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
