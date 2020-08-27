const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "deadmoon",
  database: "employee_tracker",
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

// function for after connection is made
afterConnection = () => {
  console.log(":::::::::::::::::::::::::::");
  console.log(":::::::::::::::::::::::::::");
  console.log(":::::::");
  console.log("Employee Tracker");
  console.log(":::::::");
  console.log(":::::::::::::::::::::::::::");
  console.log(":::::::::::::::::::::::::::");
  promptUser();
};

// prompt to begin inquirer
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Quit",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View all departments") {
        showDepartments();
      }
      if (choices === "View all roles") {
        showRoles();
      }
      if (choices === "View all employees") {
        showEmployees();
      }
      if (choices === "Add a department") {
        addDepartment();
      }
      if (choices === "Add a role") {
        addRole();
      }
      if (choices === "Add an employee") {
        addEmployee();
      }
      if (choices === "Update employee role") {
        updateEmployee();
      }
      if (choices === "Quit") {
        connection.end();
      }
    });
};

// functions from prompt choice

showDepartments = () => {
  let sql = `SELECT * FROM departments`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

showRoles = () => {
  let sql = `SELECT roles.id, title, roles.salary,
  department_id, department_name
  FROM roles
  INNER JOIN departments
  ON departments.id = department_id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

showEmployees = () => {
  let sql = `SELECT employees.id, employees.first_name,
    employees.last_name, roles.title, roles.salary, 
    departments.department_name,
    CONCAT (manager.first_name, " ", manager.last_name)
    AS manager
    FROM employees
    LEFT JOIN roles
    ON roles.id = employees.role_id
    LEFT JOIN departments
    ON roles.department_id = departments.id
    LEFT JOIN employees manager
    ON employees.manager_id = manager.id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What department would you like to add?",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO departments (department_name)
        VALUES (?)`;
      connection.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log("Added " + answer.addDept + " to departments!");
        showDepartments();
      });
    });
};

addRole = () => {
  inquirer
    .prompt([
      {
        name: "role",
        type: "text",
        message: "What is the name of this position?",
      },
      {
        name: "salary",
        type: "number",
        message: "What is the salary for this position?",
      },
    ])
    .then((answer) => {
      const params = [answer.role, answer.salary];

      const roleSql = `SELECT department_name, id FROM departments`;

      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department is this role in?",
              choices: dept,
            },
          ])
          .then((deptChoice) => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sql = `INSERT INTO roles
              (title, salary, department_id)
              VALUES (?, ?, ?)`;

            connection.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("Added" + answer.roles + " to roles!");
              showRoles();
            });
          });
      });
    });
};

addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
    ])
    .then((answer) => {
      const params = [answer.firstName, answer.lastName];

      const roleSql = `SELECT roles.id, roles.title FROM roles`;

      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            params.push(role);

            const managerSql = `SELECT * FROM employees`;

            connection.promise().query(managerSql, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "What is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  params.push(manager);

                  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;

                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee has bee added!");
                    showEmployees();
                  });
                });
            });
          });
      });
    });
};

updateEmployee = () => {
  const employeeSql = `SELECT * FROM employees`;

  connection.promise().query(employeeSql,
    (err, data) => {
      if (err) throw err;

      const employees = data.map(({ id, first_name, last_name }) =>
      ({ name: first_name + " " + last_name, value: id }));

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'name',
            message: "Which employee would you like to update?",
            choices: employees
          }
        ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = [];
          params.push(employee);

          const roleSql = `SELECT * FROM roles`;

          connection.promise().query(roleSql, 
            (err, data) => {
              if (err) throw err;

              const roles = data.map(({ id, title}) =>
              ({ name: title, value: id }));

              inquirer
                .prompt([
                  {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's new role?",
                    choices: roles
                  }
                ])
                .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role);

                  let employee = params[0]
                  params[0] = role
                  params[1] = employee
                  

                  const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;

                  connection.query(sql, params,
                    (err, result) => {
                      if (err) throw err;
                      console.log('Employee has been updated');

                      showEmployees();
                    });
                });
            });
        });
    });
};

