# Backend API Endpoints Documentation

Base URL: `http://localhost:5001/api`

## Bookmarks API

### 1. Get All Bookmarks
**GET** `/bookmarks`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | No | Filter by type: `note`, `doubt`, `blog` |

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "bookmark_id_1",
      "user": "user_id",
      "itemType": "note",
      "itemId": "note_id_1",
      "item": {
        "_id": "note_id_1",
        "title": "Data Structures - Complete Guide",
        "author": {
          "_id": "author_id",
          "name": "John Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "subject": "Computer Science",
        "tags": ["DSA", "Algorithms"],
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      "createdAt": "2024-01-16T08:00:00.000Z"
    },
    {
      "_id": "bookmark_id_2",
      "user": "user_id",
      "itemType": "blog",
      "itemId": "blog_id_1",
      "item": {
        "_id": "blog_id_1",
        "title": "How to Ace Your Exams",
        "author": {
          "_id": "author_id_2",
          "name": "Jane Smith",
          "avatar": null
        },
        "tags": ["Study Tips", "Exams"],
        "createdAt": "2024-01-14T15:45:00.000Z"
      },
      "createdAt": "2024-01-16T09:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "pages": 1
  }
}
```

---

### 2. Add Bookmark
**POST** `/bookmarks`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "itemType": "note",
  "itemId": "note_id_1"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| itemType | string | Yes | Type of item: `note`, `doubt`, or `blog` |
| itemId | string | Yes | MongoDB ObjectId of the item |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "new_bookmark_id",
    "user": "user_id",
    "itemType": "note",
    "itemId": "note_id_1",
    "createdAt": "2024-01-16T10:00:00.000Z"
  }
}
```

**Response (400 Bad Request) - Already bookmarked:**
```json
{
  "success": false,
  "message": "Item already bookmarked"
}
```

---

### 3. Remove Bookmark
**DELETE** `/bookmarks/:id`

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Bookmark ID |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bookmark removed successfully"
}
```

---

### 4. Check Bookmark Status
**GET** `/bookmarks/check/:itemType/:itemId`

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| itemType | string | Type: `note`, `doubt`, or `blog` |
| itemId | string | Item ID |

**Response (200 OK):**
```json
{
  "success": true,
  "isBookmarked": true,
  "bookmarkId": "bookmark_id_1"
}
```

---

## Leaderboard API

### 1. Get Leaderboard
**GET** `/leaderboard`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| period | string | No | Time period: `all` (default), `month`, `week` |

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id_1",
      "name": "Sarah Chen",
      "avatar": "https://example.com/sarah.jpg",
      "points": 2450,
      "rank": 1,
      "stats": {
        "notesCount": 45,
        "doubtsAnswered": 120,
        "blogsCount": 12
      }
    },
    {
      "_id": "user_id_2",
      "name": "Alex Kumar",
      "avatar": null,
      "points": 2120,
      "rank": 2,
      "stats": {
        "notesCount": 38,
        "doubtsAnswered": 95,
        "blogsCount": 8
      }
    },
    {
      "_id": "user_id_3",
      "name": "Emma Wilson",
      "avatar": "https://example.com/emma.jpg",
      "points": 1890,
      "rank": 3,
      "stats": {
        "notesCount": 32,
        "doubtsAnswered": 88,
        "blogsCount": 15
      }
    }
  ],
  "period": "all"
}
```

---

### 2. Get My Rank
**GET** `/leaderboard/me`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rank": 15,
    "points": 450
  }
}
```

---

## Database Schema Suggestions

### Bookmark Model (MongoDB)
```javascript
const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['note', 'doubt', 'blog'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType'
  }
}, { timestamps: true });

// Ensure unique bookmark per user per item
bookmarkSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });
```

### User Model Extension (for Leaderboard)
```javascript
// Add these fields to existing User schema
{
  points: { type: Number, default: 0 },
  stats: {
    notesCount: { type: Number, default: 0 },
    doubtsAnswered: { type: Number, default: 0 },
    blogsCount: { type: Number, default: 0 }
  }
}
```

---

## Points System (Suggested)

| Action | Points |
|--------|--------|
| Upload a note | +10 |
| Answer a doubt | +15 |
| Write a blog | +20 |
| Note gets downloaded | +2 |
| Answer gets accepted | +25 |
| Blog gets liked | +5 |

---

## Backend Controller Examples

### Bookmark Controller (Node.js/Express)
```javascript
// GET /bookmarks
exports.getBookmarks = async (req, res) => {
  const { type } = req.query;
  const filter = { user: req.user._id };
  if (type && type !== 'all') filter.itemType = type;

  const bookmarks = await Bookmark.find(filter)
    .populate({
      path: 'itemId',
      select: 'title author tags subject createdAt',
      populate: { path: 'author', select: 'name avatar' }
    })
    .sort({ createdAt: -1 });

  // Map to include item details
  const data = bookmarks.map(b => ({
    ...b.toObject(),
    item: b.itemId
  }));

  res.json({ success: true, data });
};

// POST /bookmarks
exports.addBookmark = async (req, res) => {
  const { itemType, itemId } = req.body;
  
  const existing = await Bookmark.findOne({
    user: req.user._id,
    itemType,
    itemId
  });
  
  if (existing) {
    return res.status(400).json({ success: false, message: 'Already bookmarked' });
  }

  const bookmark = await Bookmark.create({
    user: req.user._id,
    itemType,
    itemId
  });

  res.status(201).json({ success: true, data: bookmark });
};

// DELETE /bookmarks/:id
exports.removeBookmark = async (req, res) => {
  await Bookmark.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });
  res.json({ success: true, message: 'Bookmark removed' });
};
```

### Leaderboard Controller
```javascript
// GET /leaderboard
exports.getLeaderboard = async (req, res) => {
  const { period } = req.query;
  
  let dateFilter = {};
  if (period === 'week') {
    dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'month') {
    dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
  }

  const users = await User.find({ points: { $gt: 0 } })
    .select('name avatar points stats')
    .sort({ points: -1 })
    .limit(50);

  const data = users.map((user, index) => ({
    ...user.toObject(),
    rank: index + 1
  }));

  res.json({ success: true, data, period: period || 'all' });
};

// GET /leaderboard/me
exports.getMyRank = async (req, res) => {
  const user = await User.findById(req.user._id).select('points');
  const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;
  
  res.json({ success: true, data: { rank, points: user.points } });
};
```

---

## Express Routes Setup

```javascript
// routes/bookmark.routes.js
const router = require('express').Router();
const { protect } = require('../middleware/auth');
const bookmarkController = require('../controllers/bookmark.controller');

router.use(protect); // All routes require auth

router.get('/', bookmarkController.getBookmarks);
router.post('/', bookmarkController.addBookmark);
router.delete('/:id', bookmarkController.removeBookmark);
router.get('/check/:itemType/:itemId', bookmarkController.checkBookmark);

module.exports = router;

// routes/leaderboard.routes.js
const router = require('express').Router();
const { protect } = require('../middleware/auth');
const leaderboardController = require('../controllers/leaderboard.controller');

router.use(protect);

router.get('/', leaderboardController.getLeaderboard);
router.get('/me', leaderboardController.getMyRank);

module.exports = router;

// In app.js or index.js
app.use('/api/bookmarks', require('./routes/bookmark.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));
```
