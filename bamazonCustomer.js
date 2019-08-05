var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "740Washington",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
})

function start () {
    // pull in the items to be able to push them into a list for the customer to see in the CLI
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
    inquirer.prompt({
        name: "itemSelect",
        type: "list",
        message: "What item would you like to purchase today?",
        choices: function() {
            const itemArray = [];
            for (var i = 0; i<results.length; i++) {
                itemArray.push(results[i].product_name);
            }
            return itemArray;
        }
    })
    })};