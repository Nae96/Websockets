const fs = require("fs");
	
	class Contenedor {
	  constructor(nombre) {
	    this.nombre = nombre;
	  }
	
	  
	  async save(obj) {
	    try {
	      let productos = await fs.promises.readFile(this.nombre, "utf-8");
	      productos = JSON.parse(productos);
	      if (productos.length !== 0) {
	        productos.sort((x, y) => {
	          return y.id - x.id;
	        });
	        const idprod = productos[0].id + 1;
	        productos.push({ ...obj, id: idprod});
	        await fs.promises.writeFile(
	          this.nombre,
	          JSON.stringify(productos, null, 2)
	        );
	        return idprod;
	      } else {
	        productos.push({ ...obj, id: 1 });
	        await fs.promises.writeFile(
	          this.nombre,
	          JSON.stringify(productos, null, 2)
	        );
	        return 1;
	      }
	    } catch (error) {
	      console.log("Algo salió mal!");
	    }
	  }
	  async getById(id) {
	    try {
	      let prodobtenido;
	      let productos = await fs.promises.readFile(this.nombre, "utf-8");
	      productos = JSON.parse(productos);
	      productos.forEach((prod) => {
	        if (prod.id === id) {
	          prodobtenido = prod;
	        }
	      });
	      return prodobtenido || null;
	    } catch (error) {
	      console.log("Algo salió mal!");
	    }
	  }
	  async getAll() {
	    try {
	      let productos = await fs.promises.readFile(this.nombre, "utf-8");
	      productos = JSON.parse(productos);
	      return productos;
	    } catch (error) {
	      console.log("Algo salió mal!");
	      console.log(error);
	    }
	  }
	  async deleteById(id) {
	    try {
	      let nuevoprod = [];
	      let productos = await fs.promises.readFile(this.nombre, "utf-8");
	      productos = JSON.parse(productos);
	      productos.forEach((prod) => {
	        if (prod.id !== id) {
	          nuevoprod.push(prod);
	        }
	      });
	      await fs.promises.writeFile(
	        this.nombre,
	        JSON.stringify(nuevoprod, null, 2)
	      );
	    } catch (error) {
	      console.log("Algo salió mal!");
	    }
	  }
	  async deleteAll() {
	    await fs.promises.writeFile(this.nombre, "[]");
	  }
	
	  async getProductRandom() {
	    try {
	      let productos = await fs.promises.readFile(this.nombre, "utf-8");
	      productos = JSON.parse(productos);
	      const rand = Math.floor(Math.random() * productos.length);
	      return productos[rand];
	    } catch (error) {
	      console.log("Algo salió mal!");
	    }
	  }
	
	  async modifyProduct(id, reemplazo) {
	    try {
	      let productos = await fs.promises.readFile(this.nombre, "utf-8");
	      productos = JSON.parse(productos);
	      const modificprod = await this.getById(id);
	      if (modificprod !== null) {
	        await this.deleteById(id);
	        productos = await fs.promises.readFile(this.nombre, "utf-8");
	        productos = JSON.parse(productos);
	        const nuevoprod = { ...modificprod, ...reemplazo };
	        productos.push(nuevoprod);
	        productos.sort((x, y) => x.id - y.id);
	        await fs.promises.writeFile(
	          this.nombre,
	          JSON.stringify(productos, null, 2)
	        );
	        return nuevoprod;
	      }
	      return null;
	    } catch (error) {
	      console.log("Algo salió mal!");
	    }
	  }
	}
	
	module.exports = Contenedor;
