// Dependencies
const express = require("express");
const mysql = require("mysql");
// For displaying the database in Terminal
const Table = require("easy-table");
const inquirer = require('inquirer');

// Create express app instance.
const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

// MySQL DB Connection Information (remember to change this with our specific credentials)
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

// Initiate MySQL Connection.
db.connect(err => {
  if (err) throw err;
  console.log("You're now connected!");

  // start function to load product data
  productsInv();
});

const productsInv = () => {
  // get all the data from the database and display 
  db.query("SELECT * FROM products", function (err, productsData) {
    if (err) throw err;
    console.log(Table.print(productsData));
    itemPrompt(productsData);
  });
};

const itemPrompt = (productsData) => {
  // console.log(productsData);
  // Ask user to input product to buy
  inquirer
    .prompt([{
      name: "itemToBuy",
      message: "Please enter the item_id of the product you would like to purchase.",
      type: "input",
      validate: function validate(name) {
        return !isNaN(name);
      }
    }]).then(userInput => {

      // check if user input matches any item_id in the database
      let flag = false;
      for (let i = 0; i < productsData.length; i++) {
        // console.log(productsData.length, userInput.itemToBuy);
        if (productsData[i].item_id === parseInt(userInput.itemToBuy)) {
          // store the item_id, stock_quantity and price to a variable and pass as arguments to quantity function
          let productToBuy = productsData[i].item_id;
          let stock = productsData[i].stock_quantity;
          let unitCost = (productsData[i].price);
          
          flag = true;
          // console.log(productToBuy, stock, unitCost)
          quantityPrompt(productToBuy, stock, unitCost);

        }
      }
      if (flag === false) {

        console.log("Incorrect item_id! Try again.");
        productsInv();
        
      }


    });
}
// function to ask user for quantity of product to buy
function quantityPrompt(productToBuy, stock, unitCost) {
  // console.log(productToBuy, stock, unitCost)
  inquirer
    .prompt([{
      name: "quantityToBuy",
      message: "Please enter the quantity you would like to purchase.",
      type: "input",
      validate: function(name) {
        return !isNaN(name);
      }
    }]).then(quantity => {
      // check if user quantity is less then stock_quantity to allow purchase
      if (quantity.quantityToBuy > stock) {
        //   console.log(res.stock_quantity);
        // console.log(quantity.quantityToBuy);
        console.log("Not sufficient quantity for purchase! Try again!");
        productsInv();

      } else {
        let newStock = stock - quantity.quantityToBuy;
        let sales = quantity.quantityToBuy * unitCost;
        // console.log(quantity.quantityToBuy, unitCost);
        // console.log(productToBuy, newStock, sales);
        buyProduct(productToBuy, newStock, sales);
      }
    })
};


// function to update database - subtract user quantity from the stock_quantity
function buyProduct(productToBuy, newStock, sales) {
  
  db.query("UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newStock
      }, 
      {
        item_id: productToBuy
      }
    ], 
      
    function(error) {
      if (error) throw error;
      console.log("Thank you for purchasing item id: " + productToBuy + " for a total of $ " + sales + ".");
      productsInv();
    })
  };
  
    