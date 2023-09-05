const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'bestbuy'
});

app.use(express.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/signup', async function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;


  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existingUsers = await query(`SELECT * FROM bestbuy.customers WHERE LOWER(email) = LOWER('${email}')`);

  if (existingUsers.length > 0) {
    return res.status(201).json({message:'User already exists'});
  }
   
    // Insert user details into the database
    try{ const sql = `INSERT INTO bestbuy.customers (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
    await query(sql);
    console.log('User registered successfully');
    return res.redirect('/index.html');

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/product-info', async function(req, res) {
  const pid = req.query.pid;
  const searchQuery = req.query.searchQuery;

  if (!pid && !searchQuery) {
    return res.status(400).send('Missing pid or prodname parameter');
  }

  let sql;
  if (pid) {
    sql = `SELECT * FROM bestbuy.electrical_appliances WHERE pid = ${pid}`;
  } else {
    sql = `SELECT * FROM bestbuy.electrical_appliances WHERE prodname = '${searchQuery}'`;
  }

  try {
    const results = await query(sql);
    if (results.length === 0) {
      return res.status(404).send('Product not found');
      
    }

    const productInfo = results[0];
    const response = {
      pid: productInfo.pid,
      prodname: productInfo.prodname,
      price: productInfo.price,
      discount: productInfo.discount,
      mgf_date: productInfo.mgf_date,
    };
    res.json(response);
    
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, function(error, results, fields) {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

app.listen(3001, function() {
  console.log('Server started on port 3001');
});
