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