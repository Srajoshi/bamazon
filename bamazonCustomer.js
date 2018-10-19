// Dependencies
const express = require("express");
const mysql = require("mysql");
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

  db.query("SELECT * FROM products", function (err, productsData) {
    if (err) throw err;
    console.log(Table.print(productsData));
    itemPrompt(productsData);
  });
};

const itemPrompt = (productsData) => {
  // console.log(productsData);
  inquirer
    .prompt([{
      name: "itemToBuy",
      message: "Please enter the item_id of the product you would like to purchase (Q to Quit).",
      type: "input",
      validate: function validate(name) {
        return !isNaN(name) || name.toLowerCase === "q";
      }
    }]).then(userInput => {

      // check if user input matches item_id
      let flag = false;
      for (let i = 0; i < productsData.length; i++) {
        // console.log(productsData.length, userInput.itemToBuy);
        if (productsData[i].item_id === parseInt(userInput.itemToBuy)) {
          let productToBuy = productsData[i].item_id;
          let stock = productsData[i].stock_quantity;
          let unitCost = (productsData[i].price);
          // let itemChosen = userInput.itemToBuy
          flag = true;
          console.log(productToBuy, stock, unitCost)
          quantityPrompt(productToBuy, stock, unitCost);

        }
      }
      if (flag === false) {

        console.log("Incorrect item_id! Try again.");
        productsInv();
      }


    });
}

function quantityPrompt(productToBuy, stock, unitCost) {
  console.log(productToBuy, stock, unitCost)
  inquirer
    .prompt([{
      name: "quantityToBuy",
      message: "Please enter the quantity you would like to purchase (Q to Quit).",
      type: "input",
      validat: function validate(name) {
        return parseInt(name) <= 0 || name.toLowerCase === "q";
      }
    }]).then(quantity => {
      // db.query("SELECT stock_quantity, price FROM products WHERE ?",
      //   [{item_id: productToBuy}], function (err, res) {
      //     //  console.log(quantity);
      //     if (err) throw err;
      //     console.log(res);
          // console.log(quantity.quantityToBuy);
      if (quantity.quantityToBuy > stock) {
        //   console.log(res.stock_quantity);
        console.log(quantity.quantityToBuy);
        console.log("Not sufficient quantity for purchase! Try again!");
        productsInv();

      } else {
        let newStock = stock - quantity.quantityToBuy;
        let sales = quantity.quantityToBuy * unitCost;
        console.log(quantity.quantityToBuy, unitCost);
        console.log(productToBuy, newStock, sales);
        buyProduct(productToBuy, newStock, sales);
      }
    })
};



function buyProduct(productToBuy, newStock, sales) {
  console.log("Thank you for purchasing item id: " + productToBuy + "for total of $ " + sales + ".");
  db.query("UPDATE product SET ?, WHERE ?",
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
      console.log("Thank you for purchasing item id: " + productToBuy + " for total of $ " + sales + ".");
      productsInv();
    })
  };
  
    