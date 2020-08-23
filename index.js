const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker'
  });
   

  
  connection.end();