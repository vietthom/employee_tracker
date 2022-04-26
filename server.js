const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table')
require('dotenv').config();
const password = process.env.SECRET_KEY;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'employee_db',
    port: 3306
});

connection.connect((err)=>{
    if(err) return err;
    displayBanner();
});

displayBanner = () =>{
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    mainMenu();
};

const mainMenu=()=>{
    inquirer.prompt([
        {
            type: 'list',
            name: 'select',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
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
        switch(answer.select){
            case 'View all departments':
                showDepartments();
                break;
            case 'View all roles':
                showRoles();
                break;
            case 'View all employees':
                showEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployee();
                break;
            case 'View employees by department':
                employeeDepartments();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Delete an employee':
                deleteEmployee();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                break;
        };
    });
};