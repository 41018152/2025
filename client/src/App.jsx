import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Plus, BookOpen, Clock, Droplets, Heart, Shield, Sparkles } from 'lucide-react';

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




const NailCareTracker = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  // 指甲護理方法總表 (已補充更多方法)
  const nailCareMethods = [
    {
      method: '指甲按摩',
      materials: '指緣油、精油',
      substitute: '椰子油、橄欖油',
      usage: '每天早晚按摩30秒',
      benefits: '刺激甲床血液循環',
      principle: '提升養分輸送至指甲基部',
      tips: '加熱後按摩效果更佳',
      icon: '💆‍♀️'
    },
    {
      method: '生物素補充',
      materials: '堅果、蛋、燕麥',
      substitute: '菠菜、酪梨、番薯',
      usage: '每日攝取一份',
      benefits: '增強角蛋白、強化指甲結構',
      principle: '補充維生素B7，參與角蛋白合成',
      tips: '均衡攝取富含生物素食物',
      icon: '🥜'
    },
    {
      method: '護手霜保濕',
      materials: '護手霜',
      substitute: '凡士林、乳木果油',
      usage: '洗手後或睡前塗抹',
      benefits: '鎖水保濕，防乾裂',
      principle: '鎖水成分防止水分流失',
      tips: '隨身攜帶補擦',
      icon: '🧴'
    },
    {
      method: '鹽水泡指甲',
      materials: '海鹽+溫水',
      substitute: '加薑片、薄荷葉',
      usage: '每周2~3次泡10分鐘',
      benefits: '軟化角質、促循環',
      principle: '微刺激提升血流與排毒',
      tips: '晚上使用效果較佳',
      icon: '🧂'
    },
    {
      method: '白醋亮甲',
      materials: '白醋',
      substitute: '檸檬汁',
      usage: '每周1~2次擦拭或浸泡',
      benefits: '去黃去污、美白指甲',
      principle: '酸性去角質與殺菌作用',
      tips: '搭配棉花棒使用',
      icon: '✨'
    },
    {
      method: '使用護甲油',
      materials: '透明護甲油',
      substitute: '鈣質護甲油',
      usage: '每周塗1~2次',
      benefits: '強化指甲、防斷裂',
      principle: '建立硬膜保護層',
      tips: '可單獨使用或當底油',
      icon: '💅'
    },
    {
      method: '指甲敷膜',
      materials: '指甲膜、膠原精華',
      substitute: 'DIY橄欖油+蜂蜜',
      usage: '每周2~3次敷10分鐘',
      benefits: '滋養甲面、增強韌性',
      principle: '補水與蛋白質修復',
      tips: '可結合睡前保養',
      icon: '🎭'
    },
    {
      method: '洋蔥/大蒜塗抹',
      materials: '洋蔥汁、大蒜汁',
      substitute: '新鮮蒜泥',
      usage: '每周1次塗10分鐘',
      benefits: '殺菌防霉、促進生長',
      principle: '含硫化物刺激角質層再生',
      tips: '塗抹後需洗淨',
      icon: '🧄'
    },
    {
      method: '足夠飲水',
      materials: '開水',
      substitute: '養樂多、淡茶',
      usage: '每日攝取2000ML以上',
      benefits: '改善乾燥、防斷裂',
      principle: '補充水分維持新陳代謝',
      tips: '分多次小量飲用',
      icon: '💧'
    },
    {
      method: '減壓與放鬆',
      materials: '冥想、深呼吸',
      substitute: '音樂、芳療',
      usage: '每日10~15分鐘',
      benefits: '降低壓力荷爾蒙',
      principle: '減壓可防止壓力引起甲床病變',
      tips: '搭配芳香精油放鬆',
      icon: '🧘‍♀️'
    },
    {
      method: '避免傷害指甲',
      materials: '無需材料',
      substitute: '可戴手套',
      usage: '避免開罐摳膠翹物',
      benefits: '減少指甲裂傷與磨損',
      principle: '減少物理傷害導致斷裂',
      tips: '居家清潔戴手套',
      icon: '🛡️'
    },
    // 補充的新方法
    {
      method: '維生素E油護理',
      materials: '維生素E膠囊',
      substitute: '杏仁油、荷荷巴油',
      usage: '每晚睡前塗抹',
      benefits: '修復受損指甲、增強彈性',
      principle: '抗氧化修復指甲細胞',
      tips: '可直接刺破膠囊使用',
      icon: '💊'
    },
    {
      method: '角蛋白護理',
      materials: '角蛋白護甲精華',
      substitute: '明膠粉+水',
      usage: '每周2次深層護理',
      benefits: '重建指甲結構、增強硬度',
      principle: '補充指甲主要成分角蛋白',
      tips: '配合按摩促進吸收',
      icon: '🔬'
    }
  ];

  // 每日任務
  const dailyTasksList = [
    { key: 'massage', name: '指甲按摩', icon: '💆‍♀️' },
    { key: 'biotin', name: '生物素補充', icon: '🥜' },
    { key: 'moisturizer', name: '護手霜保濕', icon: '🧴' },
    { key: 'water', name: '足夠飲水', icon: '💧' },
    { key: 'relax', name: '減壓與放鬆', icon: '🧘‍♀️' }
  ];

  // 每週任務
  const weeklyTasksList = [
    { key: 'saltSoak', name: '鹽水泡指甲', icon: '🧂' },
    { key: 'vinegarBright', name: '白醋亮甲', icon: '✨' },
    { key: 'baseCoat', name: '護甲油使用', icon: '💅' },
    { key: 'onionGarlic', name: '洋蔥/大蒜塗抹', icon: '🧄' },
    { key: 'nailMask', name: '指甲敷膜', icon: '🎭' }
  ];

  // 獲取當前週的日期範圍
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (currentWeek * 7));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  // 格式化日期為字符串
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // 格式化週次為字符串
  const formatWeek = (weekOffset) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + (weekOffset * 7));
    return startDate.toISOString().split('T')[0].substring(0, 7);
  };

  // 切換每日任務狀態
  const toggleDailyTask = async (date, taskKey) => {
    const dateStr = formatDate(date);
    const newStatus = !dailyTasks[dateStr]?.[taskKey];
    
    const updatedTasks = {
      ...dailyTasks,
      [dateStr]: {
        ...dailyTasks[dateStr],
        [taskKey]: newStatus
      }
    };
    
    setDailyTasks(updatedTasks);
    
    // 發送到後端保存
    try {
      await fetch('/api/daily-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateStr,
          taskKey,
          completed: newStatus
        })
      });
    } catch (error) {
      console.error('保存每日任務失敗:', error);
    }
  };

  // 切換每週任務狀態
  const toggleWeeklyTask = async (taskKey) => {
    const weekStr = formatWeek(currentWeek);
    const newStatus = !weeklyTasks[weekStr]?.[taskKey];
    
    const updatedTasks = {
      ...weeklyTasks,
      [weekStr]: {
        ...weeklyTasks[weekStr],
        [taskKey]: newStatus
      }
    };
    
    setWeeklyTasks(updatedTasks);
    
    // 發送到後端保存
    try {
      await fetch('/api/weekly-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          week: weekStr,
          taskKey,
          completed: newStatus
        })
      });
    } catch (error) {
      console.error('保存每週任務失敗:', error);
    }
  };

  // 更新美甲時間
  const updateManicureTime = async (field, value) => {
    const updatedTime = { ...manicureTime, [field]: value };
    setManicureTime(updatedTime);
    
    try {
      await fetch('/api/manicure-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTime)
      });
    } catch (error) {
      console.error('保存美甲時間失敗:', error);
    }
  };

  // 載入數據
  useEffect(() => {
    const loadData = async () => {
      try {
        // 載入每日任務
        const dailyResponse = await fetch('/api/daily-tasks');
        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          setDailyTasks(dailyData);
        }

        // 載入每週任務
        const weeklyResponse = await fetch('/api/weekly-tasks');
        if (weeklyResponse.ok) {
          const weeklyData = await weeklyResponse.json();
          setWeeklyTasks(weeklyData);
        }

        // 載入美甲時間
        const manicureResponse = await fetch('/api/manicure-time');
        if (manicureResponse.ok) {
          const manicureData = await manicureResponse.json();
          setManicureTime({ ...manicureTime, ...manicureData });
        }
      } catch (error) {
        console.error('載入數據失敗:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          💅 指甲保護追蹤本 💅
        </h1>

        {/* 指甲護理方法總表 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="text-purple-600" />
            指甲護理方法總表
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nailCareMethods.map((method, index) => (
              <div key={index} className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4 border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{method.icon}</span>
                  <h3 className="font-bold text-lg text-purple-800">{method.method}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-purple-700">材料：</span>{method.materials}</p>
                  <p><span className="font-semibold text-purple-700">代替：</span>{method.substitute}</p>
                  <p><span className="font-semibold text-purple-700">使用：</span>{method.usage}</p>
                  <p><span className="font-semibold text-purple-700">效用：</span>{method.benefits}</p>
                  <p><span className="font-semibold text-purple-700">原理：</span>{method.principle}</p>
                  <p><span className="font-semibold text-purple-700">建議：</span>{method.tips}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 美甲時間記錄 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-pink-600" />
            美甲時間記錄
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-pink-50 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-pink-800">手部美甲時間</h3>
              <div className="space-y-2">
                <input
                  type="time"
                  value={manicureTime.handStart}
                  onChange={(e) => updateManicureTime('handStart', e.target.value)}
                  className="w-full p-2 border border-pink-200 rounded"
                  placeholder="開始時間"
                />
                <input
                  type="time"
                  value={manicureTime.handEnd}
                  onChange={(e) => updateManicureTime('handEnd', e.target.value)}
                  className="w-full p-2 border border-pink-200 rounded"
                  placeholder="結束時間"
                />
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-purple-800">腳部美甲時間</h3>
              <div className="space-y-2">
                <input
                  type="time"
                  value={manicureTime.footStart}
                  onChange={(e) => updateManicureTime('footStart', e.target.value)}
                  className="w-full p-2 border border-purple-200 rounded"
                  placeholder="開始時間"
                />
                <input
                  type="time"
                  value={manicureTime.footEnd}
                  onChange={(e) => updateManicureTime('footEnd', e.target.value)}
                  className="w-full p-2 border border-purple-200 rounded"
                  placeholder="結束時間"
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-blue-800">手部卸甲時間</h3>
              <div className="space-y-2">
                <input
                  type="time"
                  value={manicureTime.handRemovalStart}
                  onChange={(e) => updateManicureTime('handRemovalStart', e.target.value)}
                  className="w-full p-2 border border-blue-200 rounded"
                  placeholder="開始時間"
                />
                <input
                  type="time"
                  value={manicureTime.handRemovalEnd}
                  onChange={(e) => updateManicureTime('handRemovalEnd', e.target.value)}
                  className="w-full p-2 border border-blue-200 rounded"
                  placeholder="結束時間"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={manicureTime.handComplete}
                    onChange={(e) => updateManicureTime('handComplete', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">完成</span>
                </label>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-green-800">腳部卸甲時間</h3>
              <div className="space-y-2">
                <input
                  type="time"
                  value={manicureTime.footRemovalStart}
                  onChange={(e) => updateManicureTime('footRemovalStart', e.target.value)}
                  className="w-full p-2 border border-green-200 rounded"
                  placeholder="開始時間"
                />
                <input
                  type="time"
                  value={manicureTime.footRemovalEnd}
                  onChange={(e) => updateManicureTime('footRemovalEnd', e.target.value)}
                  className="w-full p-2 border border-green-200 rounded"
                  placeholder="結束時間"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={manicureTime.footComplete}
                    onChange={(e) => updateManicureTime('footComplete', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">完成</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 週次導航 */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentWeek(currentWeek - 1)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              上週
            </button>
            <span className="text-xl font-bold text-purple-800">
              {currentWeek === 0 ? '本週' : currentWeek > 0 ? `未來第${currentWeek}週` : `過去第${Math.abs(currentWeek)}週`}
            </span>
            <button
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              下週
            </button>
          </div>
        </div>

        {/* 每日任務表 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            每日任務表
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <th className="p-3 text-left">日期</th>
                  {dailyTasksList.map(task => (
                    <th key={task.key} className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{task.icon}</span>
                        <span className="text-xs">{task.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekDates.map((date, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition-colors`}>
                    <td className="p-3 font-semibold text-blue-900">
                      {date.getMonth() + 1}/{date.getDate()} ({weekdays[date.getDay()]})
                    </td>
                    {dailyTasksList.map(task => (
                      <td key={task.key} className="p-3 text-center">
                        <button
                          onClick={() => toggleDailyTask(date, task.key)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            dailyTasks[formatDate(date)]?.[task.key]
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {dailyTasks[formatDate(date)]?.[task.key] ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 每週任務表 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="text-purple-600" />
            本週任務
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weeklyTasksList.map(task => {
              const weekStr = formatWeek(currentWeek);
              const isCompleted = weeklyTasks[weekStr]?.[task.key];
              return (
                <div
                  key={task.key}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-green-100 border-green-500'
                      : 'bg-purple-50 border-purple-200 hover:border-purple-400'
                  }`}
                  onClick={() => toggleWeeklyTask(task.key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{task.icon}</span>
                      <span className="font-semibold text-purple-900">{task.name}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}>
                      {isCompleted ? <Check size={16} /> : <Plus size={16} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 進度統計 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-900">本週每日任務完成率</h3>
            <div className="space-y-2">
              {dailyTasksList.map(task => {
                const completedDays = weekDates.filter(date => 
                  dailyTasks[formatDate(date)]?.[task.key]
                ).length;
                const percentage = (completedDays / 7) * 100;
                return (
                  <div key={task.key} className="flex items-center gap-3">
                    <span className="text-lg">{task.icon}</span>
                    <span className="flex-1 text-sm font-medium">{task.name}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-blue-900">{completedDays}/7</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-900">本週週任務完成率</h3>
            <div className="space-y-2">
              {weeklyTasksList.map(task => {
                const weekStr = formatWeek(currentWeek);
                const isCompleted = weeklyTasks[weekStr]?.[task.key];
                return (
                  <div key={task.key} className="flex items-center gap-3">
                    <span className="text-lg">{task.icon}</span>
                    <span className="flex-1 text-sm font-medium">{task.name}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300'
                    }`}>
                      {isCompleted ? <Check size={16} /> : <X size={16} />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="text-center">
                <span className="text-2xl font-bold text-purple-900">
                  {weeklyTasksList.filter(task => {
                    const weekStr = formatWeek(currentWeek);
                    return weeklyTasks[weekStr]?.[task.key];
                  }).length} / {weeklyTasksList.length}
                </span>
                <p className="text-sm text-purple-700">任務完成</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NailCareTracker;
