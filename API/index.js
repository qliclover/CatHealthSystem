const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// for password use
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// localhost
app.use(cors({
    origin: 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// testing
app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// GET get all cats' info
app.get('/api/cats', async (req, res) => {
    const cats = await prisma.cat.findMany();
    res.json(cats);
});

// Log in function
const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({ error: 'Not logged in' });

    try {
        const user = require('jsonwebtoken').verify(token, 'my_secret');
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// register
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // check if user alreay exist
        const existing = await prisma.user.findFirst({
            where: {OR: [{ username }, { email }] },
        });
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // handling passwords
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new acount
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        res.json({ message: 'User registered', user: { id: user.id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login funtion
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: { username }
      });
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, 'my_secret', {
        expiresIn: '7d'
      });
  
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax'
      });
  
      res.json({ message: 'Login successful' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

//   Add cats
app.post('/api/cats', requireAuth, async (req, res) => {
    const { name, age } = req.body;
    const userId = req.user.id;
  
    try {
      const newCat = await prisma.cat.create({
        data: {
          name,
          age: parseInt(age),
          userId
        }
      });
  
      res.json(newCat);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create cat' });
    }
  });

//   Add health record
app.post('/api/health_records', requireAuth, async (req, res) => {
  const {
    catId,
    visit_date,
    hospital_name,
    vet_name,
    visit_reason,
    symptom_description,
    symptom_duration,
    symptom_trigger
  } = req.body;

  try {
    const record = await prisma.healthRecord.create({
      data: {
        catId: parseInt(catId),
        visit_date: new Date(visit_date),
        hospital_name,
        vet_name,
        visit_reason,
        symptom_description,
        symptom_duration,
        doctor_notes
      },
    });

    res.json(record);
  } catch (err) {
    console.error('Failed to create hospital record:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Delecte records
app.delete('/api/health_records/:id', requireAuth, async (req, res) => {
  const recordId = parseInt(req.params.id);

  try {
    await prisma.healthRecord.delete({
      where: { id: recordId }
    });

    res.json({ message: 'Record deleted' });
  } catch (err) {
    console.error('Failed to delete record:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});



//   Get all health record 
app.get('/api/cats/:id/records', requireAuth, async (req, res) => {
    const catId = parseInt(req.params.id);

    try {
        const records = await prisma.healthRecord.findMany({
            where: { catId },
            orderBy: { id: 'desc' }
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get records'});
    }
});

// GET single cats info
app.get('/api/cats/:id', requireAuth, async (req, res) => {
    const catId = parseInt(req.params.id);

    try {
        const cat = await prisma.cat.findUnique({
            where: { id: catId }
        });

        if (!cat) {
            return res.status(404).json({ error: 'Cat not found' });
        }

        res.json(cat);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get cat info' });
    }
});

// start server
app.listen(8000, () => {
    console.log('🚀 Server running at http://localhost:8000');
})