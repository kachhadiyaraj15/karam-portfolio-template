---
title: Building Scalable REST APIs
date: 2025-01-05
published: false
tags: [Backend, API, Architecture]
excerpt: Best practices and patterns for designing and building scalable REST APIs that can grow with your application.
readingTime: 10 min read
---

Building APIs that can scale from hundreds to millions of users requires careful planning and adherence to best practices. In this guide, we'll explore the principles and patterns for creating robust, scalable REST APIs.

## What Makes an API Scalable?

A scalable API should:

* Handle increasing load without degrading performance
* Be maintainable and easy to extend
* Follow consistent patterns and conventions
* Include proper error handling and validation
* Be well-documented

## REST API Design Principles

### 1. Resource-Based URLs

Use nouns, not verbs, in your endpoints:

```
✅ Good:
GET    /api/users
GET    /api/users/123
POST   /api/users
PUT    /api/users/123
DELETE /api/users/123

❌ Bad:
GET    /api/getUsers
POST   /api/createUser
POST   /api/deleteUser/123
```

### 2. HTTP Methods

Use appropriate HTTP methods:

* **GET**: Retrieve resources
* **POST**: Create new resources
* **PUT**: Update entire resources
* **PATCH**: Partial updates
* **DELETE**: Remove resources

### 3. Status Codes

Return meaningful HTTP status codes:

* **200 OK**: Successful GET, PUT, PATCH
* **201 Created**: Successful POST
* **204 No Content**: Successful DELETE
* **400 Bad Request**: Invalid input
* **401 Unauthorized**: Authentication required
* **403 Forbidden**: Authenticated but not authorized
* **404 Not Found**: Resource doesn't exist
* **500 Internal Server Error**: Server error

## Implementation Example

Here's a Node.js/Express example:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory database (use a real database in production)
let users = [];
let nextId = 1;

// GET all users
app.get('/api/users', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    res.json({
        data: paginatedUsers,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: users.length
        }
    });
});

// GET single user
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ data: user });
});

// POST create user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
        return res.status(400).json({ 
            error: 'Name and email are required' 
        });
    }
    
    const newUser = {
        id: nextId++,
        name,
        email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({ data: newUser });
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ 
            error: 'Name and email are required' 
        });
    }
    
    users[userIndex] = {
        ...users[userIndex],
        name,
        email,
        updatedAt: new Date().toISOString()
    };
    
    res.json({ data: users[userIndex] });
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    
    res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

## Best Practices for Scalability

### 1. Pagination

Always paginate large datasets:

```javascript
app.get('/api/posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find()
        .skip(skip)
        .limit(limit);
    
    const total = await Post.countDocuments();
    
    res.json({
        data: posts,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});
```

### 2. Caching

Implement caching to reduce database load:

```javascript
const redis = require('redis');
const client = redis.createClient();

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = `user:${id}`;
    
    // Try cache first
    const cached = await client.get(cacheKey);
    if (cached) {
        return res.json({ data: JSON.parse(cached), cached: true });
    }
    
    // Fetch from database
    const user = await User.findById(id);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Cache for 1 hour
    await client.setex(cacheKey, 3600, JSON.stringify(user));
    
    res.json({ data: user, cached: false });
});
```

### 3. Rate Limiting

Protect your API from abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);
```

### 4. Input Validation

Always validate and sanitize input:

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users',
    body('email').isEmail().normalizeEmail(),
    body('name').trim().isLength({ min: 2, max: 50 }),
    body('age').optional().isInt({ min: 0, max: 150 }),
    async (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // Process valid data
        const user = await User.create(req.body);
        res.status(201).json({ data: user });
    }
);
```

### 5. Error Handling Middleware

Centralize error handling:

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(status).json({
        error: {
            message,
            status,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});
```

## API Documentation

Document your API using tools like:

* **Swagger/OpenAPI**: Industry standard
* **Postman**: Great for testing and documentation
* **API Blueprint**: Markdown-based documentation

Example OpenAPI specification:

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /api/users:
    get:
      summary: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
```

## Security Considerations

1. **Authentication**: Use JWT or OAuth 2.0
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly
4. **SQL Injection**: Use parameterized queries
5. **XSS**: Sanitize user input

## Monitoring and Logging

Implement proper logging and monitoring:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

app.use((req, res, next) => {
    logger.info({
        method: req.method,
        url: req.url,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    next();
});
```

## Conclusion

Building scalable REST APIs requires:

* Following REST principles and conventions
* Implementing proper error handling and validation
* Using caching and pagination
* Securing your endpoints
* Monitoring and logging
* Comprehensive documentation

Start with these fundamentals, and your APIs will be ready to scale! 🚀
