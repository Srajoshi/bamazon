# bamazon

## Overview

I created an Amazon-like storefront with the MySQL. The app takes in orders from customers and depletes stock from the store's inventory. 

It uses the MySQL, esy-table and Inquirer npm packages. 

1. I created a MySQL Database called `bamazon`.

2. Then created a Table inside of that database called `products`.

3. The products table has each of the following columns:

   * item_id (unique id for each product)

   * product_name (Name of product)

   * department_name

   * price (cost to customer)

   * stock_quantity (how much of the product is available in stores)

4. The database with 10 different products. 

5. The create a Node application called `bamazonCustomer.js`. Running this application first display all of the items available for sale in a table format.

6. The app then prompt users with two messages.

   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.

7. Once the customer has placed the order, the application checks if the store has enough of the product to meet the customer's request.

   * If not, the app displays `Insufficient quantity!`, and then prevent the order from going through.

8. However, if the store _does_ have enough of the product, it fulfills the customer's order and updates the SQL database to reflect the remaining quantity and displays the total sale amount. 


Here are two screen shots to show the app:

![alt text](/images/correctqty.jpg "Survey questions") 


![alt text](/images/insufficient.jpg "Survey questions") 

## Technologies Used

  * Node.js
  * mySQL
  * Javascript
  * jQuery

