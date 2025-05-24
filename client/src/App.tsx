import React, { useState, useEffect } from 'react';

const App = () => {
  const [dailyTasks, setDailyTasks] = useState({});
  const [weeklyTasks, setWeeklyTasks] = useState({});
  const [manicureTime, setManicureTime] = useState({
    handStart: '',
    handEnd: '',
    footStart: '',
    footEnd: '',
    handRemovalStart: '',
    handRemovalEnd: '',
    footRemovalStart: '',
    footRemovalEnd: '',
    handComplete: false,
    footComplete: false
  });

  // 抓每日任務
  useEffect(() => {
    const load = async () => {
      try {
        const daily = await fetch('https://nail-care-api.onrender.com/api/daily-tasks');
        if (daily.ok) setDailyTasks(await daily.json());

        const weekly = await fetch('https://nail-care-api.onrender.com/api/weekly-tasks');
        if (weekly.ok) setWeeklyTasks(await weekly.json());

        const mani = await fetch('https://nail-care-api.onrender.com/api/manicure-time');
        if (mani.ok) setManicureTime(await mani.json());
      } catch (err) {
        console.error('載入失敗：', err);
      }
    };
    load();
  }, []);

  // 顯示簡單資料預覽
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>💅 指甲保養追蹤本</h1>
      <h2>每日任務資料</h2>
      <pre>{JSON.stringify(dailyTasks, null, 2)}</pre>

      <h2>每週任務資料</h2>
      <pre>{JSON.stringify(weeklyTasks, null, 2)}</pre>

      <h2>美甲時間</h2>
      <pre>{JSON.stringify(manicureTime, null, 2)}</pre>
    </div>
  );
};

export default App;
