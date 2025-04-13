require('dotenv').config();
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
  origin: ["https://cathealthsystem.vercel.app", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

app.use(express.json());
app.use(cookieParser());

// testing
app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// GET get all cats' info
app.get('/api/cats', requireAuth, async (req, res) => {
    try {
        const cats = await prisma.cat.findMany({
            where: {
                userId: req.user.id
            }
        });
        res.json(cats);
    } catch (error) {
        console.error('Failed to fetch cats:', error);
        res.status(500).json({ error: 'Failed to fetch cats' });
    }
});

// Log in function
const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({ error: 'Not logged in' });

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// --------register--------
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

// Create test account if it doesn't exist
const createTestAccount = async () => {
    try {
        const testUser = await prisma.user.findFirst({
            where: { username: 'clover' }
        });

        if (!testUser) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            await prisma.user.create({
                data: {
                    username: 'clover',
                    email: 'test@example.com',
                    password: hashedPassword
                }
            });
            console.log('Test account created');
        }
    } catch (error) {
        console.error('Failed to create test account:', error);
    }
};

// Call the function when server starts
createTestAccount();

// --------Login funtion--------
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
  
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
  
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
  
      res.json({ message: 'Login successful' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

//   --------Add cats--------
app.post('/api/cats', requireAuth, async (req, res) => {
  const { 
    name, 
    age, 
    weight, 
    birthday, 
    arrival_date, 
    usual_food, 
    is_dewormed 
  } = req.body;
  const userId = req.user.id;

  try {
    const newCat = await prisma.cat.create({
      data: {
        name,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        birthday: birthday ? new Date(birthday) : null,
        arrival_date: arrival_date ? new Date(arrival_date) : null,
        usual_food,
        is_dewormed: is_dewormed || false,
        userId
      }
    });

    res.json(newCat);
  } catch (err) {
      console.error('Failed to create cat:', err);
      res.status(500).json({ error: 'Failed to create cat' });
  }
});

//   --------Add health record--------
app.post('/api/health_records', requireAuth, async (req, res) => {
  const {
    catId,
    visit_date,
    hospital_name,
    vet_name,
    visit_reason,
    symptom_description,
    symptom_duration,
    doctor_notes
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

// --------Update records--------
app.put('/api/health_records/:id', requireAuth, async (req, res) => {
  const recordId = parseInt(req.params.id);
  const {
    visit_date,
    hospital_name,
    vet_name,
    visit_reason,
    symptom_description,
    symptom_duration,
    doctor_notes
  } = req.body;

  try {
    const updated = await prisma.healthRecord.update({
      where: { id: recordId },
      data: {
        visit_date: new Date(visit_date),
        hospital_name,
        vet_name,
        visit_reason,
        symptom_description,
        symptom_duration,
        doctor_notes
      }
    });

    res.json(updated);
  } catch (err) {
    console.error('Failed to update record:', err);
    res.status(500).json({ error: 'Failed to update records'})
  }
})

// --------Update Cat--------
app.put('/api/cats/:id', requireAuth, async (req, res) => {
  const catId = parseInt(req.params.id);
  const { 
    name, 
    age,
    weight,
    birthday,
    arrival_date,
    usual_food,
    is_dewormed
  } = req.body;

  try {
    const updated = await prisma.cat.update({
      where: { id: catId },
      data: {
        name,
        age: parseInt(age),
        weight: parseFloat(weight),
        birthday: birthday ? new Date(birthday) : null,
        arrival_date: arrival_date ? new Date(arrival_date) : null,
        usual_food,
        is_dewormed
      }
    });
    res.json(updated);
  } catch (err) {
    console.error('Failed to update cat:', err);
    res.status(500).json({ error: 'Failed to update cat' });
  }
});

// --------Delecte records--------
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

// --------Delecte Cat--------
// Delete health records first then cat
app.delete('/api/cats/:id', requireAuth, async (req, res) => {
  const catId = parseInt(req.params.id);

  try {
    await prisma.healthRecord.deleteMany({
      where: { catId }
    });
    
    await prisma.cat.delete({
      where: { id: catId }
    });

    res.json({ message: 'Cat deleted' });
  } catch (err) {
    console.error('Failed to delete cat:', err);
    res.status(500).json({ error: 'Failed to delete cat' });
  }
});



//   --------Get all health record-------- 
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

// --------GET single cats info--------
app.get('/api/cats/:id', requireAuth, async (req, res) => {
    const catId = parseInt(req.params.id);

    try {
        const cat = await prisma.cat.findUnique({
            where: { id: catId },
        });

        if (!cat) {
            return res.status(404).json({ error: 'Cat not found' });
        }

        res.json(cat);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get cat info' });
    }
});

// --------GET single health record--------
app.get('/api/health_records/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const record = await prisma.healthRecord.findUnique({
      where: { id }
    });

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(record);
  } catch (err) {
    console.error('Failed to get record:', err);
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

// Check authentication status
app.get('/api/check-auth', requireAuth, (req, res) => {
    res.json({ authenticated: true });
});

// start server
const PORT = parseInt(process.env.PORT) || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});