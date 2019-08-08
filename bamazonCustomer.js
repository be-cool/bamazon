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

connection.connect(function (err) {
    if (err) throw err;
    inventory();
})

function inventory() {
    // pull in the items to be able to push them into a list for the customer to see in the CLI
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "itemSelect",
                type: "list",
                message: "What item would you like to purchase today?",
                choices: function () {
                    const itemArray = [];
                    for (var i = 0; i < results.length; i++) {
                        itemArray.push(results[i].product_name);
                    }
                    return itemArray;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?"
            }
        ])
            .then(function (input) {
                const item = list.itemSelect;
                const quantity = input.quantity;
                // const chosenItem = '';
                const queryStr = 'SELECT * FROM products WHERE ?';

                // for (var i = 0; i < results.length; i++) {
                //     if (results[i].item_name === answer.choice) {
                //         chosenItem = results[i];
                //     }
                //     return (chosenItem);
                // }
                connection.query(queryStr, { item_id: item }, function (err, data) {
                    if (err) throw err;

                    else if (quantity <= productData.stock_quantity) 
                        console.log('Congratulations, the product you requested is in stock! Placing order!');

                        // Construct the updating query string
                        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                        // console.log('updateQueryStr = ' + updateQueryStr);

                        // Update the inventory
                        connection.query(updateQueryStr, function (err, data) {
                            if (err) throw err;

                            console.log('Your order has been placed. The total cost is $' + productData.price * quantity);
                            console.log("\n---------------------------------------------------------------------\n");

                            // End the database connection
                            connection.end();
                        })
                         {
                        console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
                        console.log('Please modify your order.');
                        console.log("\n---------------------------------------------------------------------\n");

                        displayInventory();
                    };

                });
            })
    })};