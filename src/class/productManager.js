import fs from "node:fs"

class ProductManager {
    constructor(path){
        this.path=path;
    }

    async addProduct(product){
        await fs.promises.writeFile(this.path, JSON.stringify({data: []}))
    }
}

export default ProductManager