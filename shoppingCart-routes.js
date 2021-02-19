const express = require('express');
const shoppingCart = express.Router();
const pool = require('./connection');

shoppingCart.get("/", (req, res) => {

    let maxPrice = parseFloat(req.query.maxPrice);
    if (maxPrice) {

        pool.query("SELECT * FROM shopping_cart WHERE price <=$1", [maxPrice]).then((results) => {
            res.json(results.rows);
        });
    }
    if (req.query.prefix) {

        pool.query("SELECT * FROM shopping_cart WHERE product LIKE $1", [req.query.prefix + "%"]).then((results) => {
            res.json(results.rows);
        });
    }

    let pageSize = parseInt(req.query.pageSize);
    if (pageSize || pageSize === 0) {
        pool.query("SELECT * FROM shopping_cart LIMIT $1", [pageSize]).then((results) => {
            res.json(results.rows);
        });
    }

    else {
        pool.query("SELECT * FROM shopping_cart").then((results) => {
            res.json(results.rows);
        });
    }
});

shoppingCart.get("/:id", (req, res) => {

    let id = parseInt(req.params.id);
    pool.query("SELECT * FROM shopping_cart WHERE id=$1", [id]).then((results) => {
        res.json(results.rows);
    });
});

shoppingCart.post("/", (req, res) => {

    let product = req.body.product;
    let price = parseFloat(req.body.price);
    let quantity = parseInt(req.body.quantity);
    pool.query(`INSERT INTO shopping_cart (product, price, quantity)
                VALUES ($1, $2, $3) RETURNING *`, [product, price, quantity]).then((results) => {
        res.status(201);
        res.json(results.rows);
    });
});

shoppingCart.put("/:id", (req, res) => {

    let id = parseInt(req.params.id);
    let product = req.body.product;
    let price = parseFloat(req.body.price);
    let quantity = parseInt(req.body.quantity);

    pool.query(`UPDATE shopping_cart
                SET product=$1, price=$2, quantity=$3
                WHERE id=$4
                RETURNING *`, [product, price, quantity, id]).then((results) => {
        res.json(results.rows);
    });
});

shoppingCart.delete("/:id", (req, res) => {
    let id = parseInt(req.params.id);
    pool.query(`DELETE FROM shopping_cart
                WHERE id=$4`, [id]).then((results) => {
        res.json(results.rows);
    });
});

module.exports = shoppingCart;