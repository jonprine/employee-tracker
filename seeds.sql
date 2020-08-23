INSERT INTO department (department_name) 
VALUES 
('Sales'), 
('Engineering'),
('Finance'), 
('Legal');

INSERT INTO employee_role (title, salary, department_id)
VALUES
('Sales Lead', 90,000, 1),
('Salesperson', 75,000, 1),
('Lead Engineer', 100,000, 2),
('Software Engineer', 85,000, 2),
('Accountant', 70,000, 3),
('Account Manager', 90,000, 3),
('Legal Team Lead', 110,000, 4)
('Lawyer', 95,000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Nic', 'Cage', 1, null),
('Amber', 'Collins', 2, 1),
('Roky', 'Erickson', 3, null),
('Seth', 'Murray', 4, 3),
('Madeline', 'Smith', 5, 6),
('Bill', 'Ward', 6, null),
('Sara' 'Miller', 7, null),
('George', 'Jones', 8, 7);
