const connection = require('./connection');
const inquirer= require('inquirer');
const cTable = require('console.table');

const welcomeSign = () =>{
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    menu();
};

welcomeSign();

const menu = () =>{
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            options: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employee role', 
                'Update an employee Manager', 
                'View employees by department', 
                'Delete a department', 
                'Delete a role', 
                'Delete an employee', 
                'View department budgets',
                'Exit'
            ]
        }
    ])
    .then((answer)=>{
        const {options} = answer;

        if (options === 'View all departments'){
            viewDepartments();
        }

        if (options === 'View all roles'){
            viewRoles();
        }

        if (options === 'View all employees'){
            viewEmployees();
        }

        if(options === 'Add a department'){
            addDepartment();
        }

        if(options === 'Add a role'){
            addRole();
        }

        if(options === 'Add an employee'){
            addEmployee();
        }

        if(options === 'Update an employee role'){
            updateRole();
        }

        if(options === 'Update an employee manager'){
            updateManager();
        }

        if(options === 'View employees by department'){
            employeeDepartment();
        }

        if(options === 'Delete a department'){
            deleteDepartment();
        }

        if(options === 'Delete a role'){
            deleteRole();
        }

        if(options === 'Delete an employee'){
            deleteEmployee();
        }

        if(option === 'View department budgets'){
            viewBudget();
        }

        if(options === 'Exit'){
            connection.end();
        }
    });
};

viewDepartments = () =>{
    console.log('Gathering all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    connection.promise().query(sql, (err,rows)=>{
        if (err) throw err;
        console.table(rows);
        menu();
    });
};

viewRoles = () =>{
    console.log('Gathering all roles...\n');
    const sql = `SELECT role.id, role.title, deparment.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (err,rows)=>{
        if(err) throw err;
        console.table(rows);
        menu();
    })
};

viewEmployees=()=>{
    console.log('Gathering all employees...\n');
    const sql = `SELECT employee.id,
                        employee.first_name,
                        employee.last_name,
                        role.title, 
                        department.name AS department, 
                        role.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                        LEFT JOIN role ON employee.role_id=role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id=manager.id`;
    connection.promise().query(sql, (err,rows)=>{
        if(err) throw err;
        console.table(rows);
        menu();
    })
}

addDepartment=()=>{
    inquier.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What deparment do you want to add?',
            validate: addDept =>{
                if(addDept){
                    return true;
                }else{
                    console.log('Please enter a department name');
                    return false;
                }
            }
        }
    ])
    .then(answer=>{
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.addDept, (err, result)=>{
            if (err) throw err;
            console.log('Added ' + answer.addDept + ' to departments!');

            viewDepartments();
        });
    });
};

addRole=()=>{
    inquier.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What role do you want to add?',
            validate: addRole =>{
                if(addRole){
                    return true;
                }else{
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'WHat is the salary for this role?',
            validate: addSalary=>{
                if(isNAN(addSalary)){
                    return true;
                }else{
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
    ])
    .then(answer =>{
        const params= [answer.role, answer.salary];
        const roleSql = `SELECT name, id FROM Department`;

        connection.promise().query(roleSql,(err,data)=>{
            if(err) throw err;

            const dept = data.map(({name, id})=>({name: name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ])
            .then(deptChoice =>{
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id)
                            VALUES (?, ?, ?)`;

                connection.query(sql, params, (err, result)=>{
                    if(err) throw err;
                    console.log('Added' + answer.role + 'to roles!');

                    viewRoles();
                });
            });
        });
    });
};

addEmployee=()=>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: addFirstName =>{
                if(addFirstName){
                    return true;
                }else{
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLastName =>{
                if(addLastName){
                    return true;
                }else{
                    console.log('Please enter a first name');
                    return false;
                }
            }
        } 
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName];

        const roleSql = `SELECT role.id, role.title FROM role`;

        connection.promise().query(roleSql, (err, data)=>{
            if (err) throw err;

            const roles = data.map(({id, title})=>({name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles
                }
            ])
            .then(roleChoice =>{
                const role = roleChoice.role;
                params.push(role);

                const managerSql = `SELECT * FROM employee`;

                connection.promise().query(managerSql, (err,data)=>{
                    if (err) throw err;
                    const managers = data.map(({id, first_name, last_name})=>({name: first_name + " "+ last_name, value: id}));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ])
                    .then(managerChoice =>{
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?,?,?,?)`;

                        connection.query(sql, params, (err, result)=>{
                            if(err) throw err;
                            console.log('Employee has been added!');

                            viewEmployee();
                        });
                    });
                });
            });
        });
    });
};

updateRole=()=>{
    const employeeSql= `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data)=>{
        if(err) throw err;

        const employees = data.map(({ id, first_name, last_name})=>({name: first_name + " " + last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update their role?",
                choices: employees
            }
        ])
        .then(empChoice=>{
            const employee = empChoice.name;
            const params = [];
            params.push(employee);

            const roleSql = `SELECT * FROM role`;

            connection.promise().query(roleSql, (err, data)=>{
                if (err) throw err;

                const roles = data.map(({id, title})=>({name: title, value: id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's new role?",
                        choices: roles
                    }
                ])
                .then(roleChoice =>{
                    const role = roleChoice.role;
                    params.push(role);

                    let employee = params[0];
                    params[0] = role;
                    params[1] = employee;

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result)=>{
                        if(err) throw err;
                        console.log('Employee role has been updated!');

                        viewEmployee();
                    });
                });
            });
        });
    });
};

updateManger = ()=>{
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data)=>{
        if(err) throw err;

        const employees = data.map(({id, first_name, last_name})=>({name: first_name + " " + last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
        .then(empChoice =>{
            const employee = empChoice.name;
            const params =[];
            params.push(employee);

            const managerSql = `SELECT * FROM employee`;

            connection.promise().query(managerSql, (err, data)=>{
                if (err) throw err;

                const manager = data.map(({id, first_name, last_name})=>({name: first_name + " " + last_name, value: id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: manager
                    }
                ])
                .then(managerChoice =>{
                    const manager = managerChoice.manager;
                    params.push(manager);

                    let employee = params[0];
                    params[0] = manager;
                    params[1]= employee;

                    const sql = `UPDATE employee SET manager_id= ? WHERE id =?`;

                    connection.query(sql, params, (err, result)=>{
                        if (err) throw err;
                        console.log("Employee's manager has been update!");

                        viewEmployee();
                    });
                });
            });
        });
    });
};

employeeDepartment=()=>{
    console.log("Gathering employee's by departments...\n");
    const sql = `SELECT employee.first_name,
                        employee.last_name,
                        department.name AS department
                FROM employee
                LEFT JOIN role ON employee.role_id=role.id
                LEFT JOIN department ON role.department_id = department.id`;
    
    connection.promise().query(sql, (err,rows)=>{
        if(err) throw err;
        console.table(rows);
        menu();
    });
};







