const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_tracker'
  });

 
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('connected as id ' + connection.threadId);
    afterConnection();
  });

  // function for after connection is made
  afterConnection = () => {
      console.log(':::::::::::::::::::::::::::')
      console.log(':::::::::::::::::::::::::::')
      console.log(':::::::')
      console.log('Employee Tracker')
      console.log(':::::::')
      console.log(':::::::::::::::::::::::::::')
      console.log(':::::::::::::::::::::::::::')
      promptUser();
  }

  // prompt to begin inquirer
  const promptUser = () => {
      inquirer.prompt ([
          {
              type: 'list',
              name: 'choices',
              message: 'What would you like to do?',
              choices: ['View all departments',
                        'View all roles',
                        'View all employees',
                        'Add a department',
                        'Add a role',
                        'Add an employee',
                        'Update employee role',
                        'Quit']
          }
      ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View all departments') {
                showDepartments();
            }
            if (choices === 'View all roles') {
                showRoles();
            }
            if (choices === 'View all employees') {
                showEmployees();
            }
            if (choices === 'Add a department') {
                addDepartment();
            }
            if (choices === 'Add a role') {
                addRole();
            }
            if (choices === 'Add an employee') {
                addEmployee();
            }
            if (choices === 'Update employee role') {
                updateEmployee();
            }
            if (choices === 'Quit') {
                connection.end();
            }
        })
  }

  
  