import express from "express"
import ProductManager from "./class/productManager.js";
import { __dirname } from "./Utils.js";

const app = express ()
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const ProductManager = new ProductManager(__dirname + "/data/product.json")

app.post("/", (req,res) => {

})

app.listen(8080, () => {
    console.log("servidor ON")
})
