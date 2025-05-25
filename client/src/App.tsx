import React, { useEffect, useState } from 'react';

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const apiBase = 'https://nail-care-api.onrender.com';

const App = () => {
  const [dailyTasks, setDailyTasks] = useState<any>({});
  const [weeklyTasks, setWeeklyTasks] = useState<any>({});
  const [manicureTime, setManicureTime] = useState<any>({});
  const [currentWeek, setCurrentWeek] = useState(0);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formatWeek = (weekOffset: number) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + (weekOffset * 7));
    return startDate.toISOString().split('T')[0].substring(0, 7);
  };

  const getWeekDates = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + (currentWeek * 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();

  useEffect(() => {
    const load = async () => {
      const res1 = await fetch(`${apiBase}/api/daily-tasks`);
      const res2 = await fetch(`${apiBase}/api/weekly-tasks`);
      const res3 = await fetch(`${apiBase}/api/manicure-time`);
      if (res1.ok) setDailyTasks(await res1.json());
      if (res2.ok) setWeeklyTasks(await res2.json());
      if (res3.ok) setManicureTime(await res3.json());
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">💅 指甲保養追蹤本</h1>

      {/* 每日任務表 */}
      <h2 className="text-xl font-semibold text-purple-700 mb-2">每日任務（顯示七天）</h2>
      <table className="w-full text-sm border rounded shadow bg-white mb-6">
        <thead className="bg-pink-100 text-pink-800">
          <tr>
            <th className="p-2">日期</th>
            <th className="p-2">按摩</th>
            <th className="p-2">保濕</th>
            <th className="p-2">喝水</th>
            <th className="p-2">放鬆</th>
          </tr>
        </thead>
        <tbody>
          {weekDates.map((d, i) => {
            const dateStr = formatDate(d);
            return (
              <tr key={i} className="text-center border-t">
                <td className="p-2 font-medium text-left">{d.getMonth() + 1}/{d.getDate()}（{weekdays[d.getDay()]}）</td>
                {['massage', 'moisturizer', 'water', 'relax'].map(key => (
                  <td className="p-2" key={key}>
                    {dailyTasks[dateStr]?.[key] ? '✅' : '—'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 每週任務統計 */}
      <h2 className="text-xl font-semibold text-purple-700 mb-2">每週任務</h2>
      <ul className="list-disc pl-6 mb-6 text-sm">
        {['saltSoak', 'vinegarBright', 'baseCoat', 'onionGarlic', 'nailMask'].map(key => {
          const weekStr = formatWeek(currentWeek);
          const isDone = weeklyTasks[weekStr]?.[key];
          const nameMap: any = {
            saltSoak: '鹽水泡指甲',
            vinegarBright: '白醋亮甲',
            baseCoat: '護甲油',
            onionGarlic: '洋蔥/大蒜',
            nailMask: '指甲敷膜'
          };
          return (
            <li key={key}>
              {nameMap[key]}：{isDone ? '✅ 完成' : '❌ 未完成'}
            </li>
          );
        })}
      </ul>

      {/* 美甲時間 */}
      <h2 className="text-xl font-semibold text-purple-700 mb-2">美甲時間</h2>
      <div className="grid grid-cols-2 gap-4 text-sm bg-purple-50 p-4 rounded shadow mb-10">
        <div>
          <strong>手部美甲：</strong>{manicureTime.handStart || '--'} ~ {manicureTime.handEnd || '--'}
        </div>
        <div>
          <strong>腳部美甲：</strong>{manicureTime.footStart || '--'} ~ {manicureTime.footEnd || '--'}
        </div>
        <div>
          <strong>手部卸甲：</strong>{manicureTime.handRemovalStart || '--'} ~ {manicureTime.handRemovalEnd || '--'}
          {manicureTime.handComplete && ' ✅ 完成'}
        </div>
        <div>
          <strong>腳部卸甲：</strong>{manicureTime.footRemovalStart || '--'} ~ {manicureTime.footRemovalEnd || '--'}
          {manicureTime.footComplete && ' ✅ 完成'}
        </div>
      </div>
    </div>
  );
};

export default App;

