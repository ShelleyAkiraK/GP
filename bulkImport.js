// bulkImport.js
const fs = require('fs');
const path = require('path');
const LiveHouse = require('./models/LiveHouse'); // 引入模型
const sequelize = require('./config/database');  // 数据库连接

(async () => {
  try {
    // 1. 读取 JSON 文件
    const filePath = path.join(__dirname, 'livehouses_data.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const livehousesArray = JSON.parse(rawData);

    // 2. 测试数据库连接
    await sequelize.authenticate();
    console.log('DB connected successfully.');

    /// 3. 遍历每个条目
    for (const houseItem of livehousesArray) {
      // 3.1 根据场地名称先检查数据库
      const exist = await LiveHouse.findOne({
        where: { name: houseItem.name },
      });

      if (exist) {
        // === 方案 A: 跳过 ===
        console.log(`LiveHouse "${houseItem.name}" already exists. Skipping...`);

        // === 方案 B: 如果想改成更新可用 ===
        /*
        await exist.update(houseItem);
        console.log(`LiveHouse "${houseItem.name}" updated with new data.`);
        */
        continue;
      }

      // 3.2 如果不存在，就新建
      await LiveHouse.create(houseItem);
      console.log(`Created new LiveHouse: "${houseItem.name}"`);
    }

    console.log('All livehouses processed.');
    process.exit(0);
  } catch (err) {
    console.error('Bulk import error:', err);
    process.exit(1);
  }
})();
