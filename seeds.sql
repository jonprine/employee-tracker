INSERT INTO departments (department_name) 
VALUES 
('Sales'), 
('Engineering'),
('Finance'), 
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Lead', 90000, 1),
('Salesperson', 75000, 1),
('Lead Engineer', 100000, 2),
('Software Engineer', 85000, 2),
('Accountant', 70000, 3),
('Account Manager', 90000, 3),
('Legal Team Lead', 110000, 4),
('Lawyer', 95000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Nic', 'Cage', 1, null),
('Amber', 'Collins', 2, 1),
('Roky', 'Erickson', 3, null),
('Seth', 'Murray', 4, 3),
('Madeline', 'Smith', 5, 3),
('Bill', 'Ward', 6, null),
('Sara', 'Miller', 7, null),
('George', 'Jones', 8, 7);
