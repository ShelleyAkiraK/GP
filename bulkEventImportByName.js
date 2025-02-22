// bulkEventImportByName.js

const fs = require('fs');
const path = require('path');
const sequelize = require('./config/database');
const LiveHouse = require('./models/LiveHouse');
const Event = require('./models/Event');

(async () => {
  try {
    // 1. 连接数据库
    await sequelize.authenticate();
    console.log('DB connected successfully.');

    // 2. 读取 JSON 文件
    const filePath = path.join(__dirname, 'events_data.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const rawArr = JSON.parse(rawData);

    // 3. 遍历每条事件数据
    for (const item of rawArr) {
      // 解构出 live_house_name, bands，其余字段放入 eventData
      const { live_house_name, bands, ...eventData } = item;

      // 3.1 根据 live_house_name 查找 LiveHouse
      const house = await LiveHouse.findOne({
        where: { name: live_house_name }
      });
      if (!house) {
        console.log(`LiveHouse '${live_house_name}' not found. Skipping event: ${eventData.title}`);
        continue;
      }
      eventData.live_house_id = house.id;

      // 3.2 如果 bands 是数组，则转为 JSON 字符串
      if (Array.isArray(bands)) {
        eventData.bands = JSON.stringify(bands);
      } else if (typeof bands === 'string') {
        eventData.bands = bands; // 如果原本就是字符串
      } else {
        eventData.bands = null;
      }

      // 3.3 插入数据 (poster_url 也在 eventData 中, 不需要特别处理)
      const newEvent = await Event.create(eventData);
      console.log(`Created event '${newEvent.title}' for LiveHouse '${live_house_name}'.`);
    }

    console.log('All events processed.');
    process.exit(0);

  } catch (err) {
    console.error('Bulk import error:', err);
    process.exit(1);
  }
})();
