INSERT INTO department(id, name) 
VALUES(1, 'Sales and Marketing'),
      (2, 'Product Development'),
      (3, 'IT Services');

INSERT INTO role(id, title, salary, department_id)
    VALUES(1, 'Sales Person', 50000, 1),
          (2, 'Project Lead', 65000, 2),
          (3, 'Full Stack Developer', 90000, 2),
          (4, 'IT Specialist', 70000, 3);

INSERT INTO employee(id, firstName, lastName, role_id, manager_id)
    VALUES(1, 'Son', 'Goku', 2, NULL),
          (1, 'Son', 'Gohan', 3, 1),
          (1, 'Son', 'Goten', 4, NULL),
          (1, 'Vegeta', 'Saiyan', 3, 1),
          (1, 'Trunks', 'Saiyan', 1, NULL),
          (1, 'Naruto', 'Uzimaki', 4, NULL),
          (1, 'Sasuke', 'Uchiha', 2, 2),
        
        