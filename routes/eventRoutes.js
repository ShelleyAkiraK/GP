// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const LiveHouse = require('../models/LiveHouse');

// 如果你没在 app.js 里加过 app.use(express.json())
// 那么就必须在每个路由文件加一遍 router.use(express.json());
router.use(express.json());

/**
 * 1) GET /events
 *    获取所有 Event 列表
 */
router.get('/', async (req, res) => {
  try {
    // 可以根据需要 include: [LiveHouse] 让它把关联的 LiveHouse 也查出来
    const events = await Event.findAll({ include: [LiveHouse] });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

/**
 * 2) GET /events/:id
 *    获取单个 Event 详情
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [LiveHouse]
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

/**
 * 3) POST /events
 *    创建新的 Event
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      bands,
      genre,
      start_time,
      end_time,
      price_info,
      ticket_url,
      description,
      live_house_id // 关联的 LiveHouse
    } = req.body;

    // 检查关联的 LiveHouse 是否存在
    const lh = await LiveHouse.findByPk(live_house_id);
    if (!lh) {
      return res.status(400).json({ error: 'Invalid live_house_id' });
    }

    // 创建新的 Event
    const newEvent = await Event.create({
      title,
      bands,
      genre,
      start_time,
      end_time,
      price_info,
      ticket_url,
      description,
      live_house_id
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

/**
 * 4) PUT /events/:id
 *    更新某个 Event
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      bands,
      genre,
      start_time,
      end_time,
      price_info,
      ticket_url,
      description,
      live_house_id
    } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // 如果要更新 live_house_id，则需要先校验是否真的存在
    if (live_house_id) {
      const lh = await LiveHouse.findByPk(live_house_id);
      if (!lh) {
        return res.status(400).json({ error: 'Invalid live_house_id' });
      }
      event.live_house_id = live_house_id;
    }

    event.title = title ?? event.title;
    event.bands = bands ?? event.bands;
    event.genre = genre ?? event.genre;
    event.start_time = start_time ?? event.start_time;
    event.end_time = end_time ?? event.end_time;
    event.price_info = price_info ?? event.price_info;
    event.ticket_url = ticket_url ?? event.ticket_url;
    event.description = description ?? event.description;

    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

/**
 * 5) DELETE /events/:id
 *    删除某个 Event
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
