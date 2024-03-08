
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');


const app = express();
const PORT = 9758;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
const uri = 'mongodb+srv://diwakar:yWwUI5qpupmNow1N@cluster0.de77o86.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('MongoDB connection error:', err);
    return;
  }
  console.log('Connected to MongoDB');
});

// Middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to get existing data from MongoDB and render the HTML form
app.get('/', async (req, res) => {
  try {
    const user_data_collection = client.db('scheme').collection('user_data');
    const existingData = await user_data_collection.find().toArray();
    
    const data_list = existingData.map(data => ({
      name: data.name,
      age: data.age,
      income: data.income,
      sex: data.sex,
    }));

    res.render('index.ejs', { data_list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to submit new form data to MongoDB
app.post('/submitFormData', async (req, res) => {
  try {
    const user_data_collection = client.db('scheme').collection('user_data');
    const { name, age, income, sex } = req.body;
 
    await user_data_collection.insertOne({
      name,
      age,
      income,
      sex,
    });

    res.render('success', { message: 'Form data submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
