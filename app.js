const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const cors = require('cors');

// 引入模型
require('./models/LiveHouse');
require('./models/Event');

// 引入路由（建议在 API 路径上加上前缀，如 /api/livehouses /api/events）
const liveHouseRoutes = require('./routes/liveHouseRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// 解析 JSON Body
app.use(express.json());

// 测试接口（此处加上 /api 前缀）
app.get('/api', (req, res) => {
  res.send('Hello, Live House MVP!');
});

// 注册路由：API 接口
app.use('/api/livehouses', liveHouseRoutes);
app.use('/api/events', eventRoutes);

// 同步数据库
sequelize.sync({ alter: true })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

/*
  如果 NODE_ENV === 'production'，则静态提供前端打包的文件
  在生产环境中，你需要先在前端执行 npm run build，生成的静态文件放入 dist/ 文件夹，
  然后后端会 serve dist/ 文件夹中的内容。
*/
if (process.env.NODE_ENV === 'production') {
  // 提供前端静态文件
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // 对于所有未匹配到的路由，返回 index.html（支持前端路由）
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});