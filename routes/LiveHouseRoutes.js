// routes/liveHouseRoutes.js
const express = require('express');
const router = express.Router();
const LiveHouse = require('../models/LiveHouse');
const Event = require('../models/Event');

// 中间件：解析 JSON 数据
// 如果你在 app.js 全局加了 app.use(express.json()) 这里也就不用再加了。
router.use(express.json());

/**
 * 1) GET /livehouses
 *    获取所有 LiveHouse 列表
 */
router.get('/', async (req, res) => {
  try {
    const liveHouses = await LiveHouse.findAll();
    res.json(liveHouses); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch live houses' });
  }
});

/**
 * 2) GET /livehouses/:id
 *    获取单个 LiveHouse 详情 & 其演出列表
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // include: [Event] 可以一并把关联的 events 返回
    const liveHouse = await LiveHouse.findByPk(id, {
      include: [Event]
    });

    if (!liveHouse) {
      return res.status(404).json({ error: 'LiveHouse not found' });
    }

    res.json(liveHouse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch live house' });
  }
});

/**
 * 3) POST /livehouses
 *    创建新的 LiveHouse
 */
router.post('/', async (req, res) => {
  try {
    const { name, address, lat, lng, website, phone, description, capacity } = req.body;
    const newLH = await LiveHouse.create({
      name,
      address,
      lat,
      lng,
      website,
      phone,
      description,
      capacity
    });
    res.status(201).json(newLH);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create live house' });
  }
});

/**
 * 4) PUT /livehouses/:id
 *    更新某个 LiveHouse
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, lat, lng, website, phone, description, capacity } = req.body;

    const liveHouse = await LiveHouse.findByPk(id);
    if (!liveHouse) {
      return res.status(404).json({ error: 'LiveHouse not found' });
    }

    liveHouse.name = name ?? liveHouse.name;
    liveHouse.address = address ?? liveHouse.address;
    liveHouse.lat = lat ?? liveHouse.lat;
    liveHouse.lng = lng ?? liveHouse.lng;
    liveHouse.website = website ?? liveHouse.website;
    liveHouse.phone = phone ?? liveHouse.phone;
    liveHouse.description = description ?? liveHouse.description;
    liveHouse.capacity = capacity ?? liveHouse.capacity;

    await liveHouse.save();
    res.json(liveHouse);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update live house' });
  }
});

/**
 * 5) DELETE /livehouses/:id
 *    删除某个 LiveHouse
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const liveHouse = await LiveHouse.findByPk(id);

    if (!liveHouse) {
      return res.status(404).json({ error: 'LiveHouse not found' });
    }

    await liveHouse.destroy();
    res.json({ message: 'LiveHouse deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete live house' });
  }
});

module.exports = router;
