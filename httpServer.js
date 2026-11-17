const http = require('http');
const fs = require('fs');

let foods = [
    { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
    { id: 2, foodName: "Burger", category: "Fast Food", price: 120, availability: true },
    { id: 3, foodName: "Coffee", category: "Beverage", price: 100, availability: false }
];

const server = http.createServer((req, res) => {

    // HOME ROUTE
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Food Ordering System</h1>");
    }

    // GET FOODS
    else if (req.url === "/foods" && req.method === "GET") {
        const availableFoods = foods.filter(food => food.availability === true);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(availableFoods));
    }

    // ABOUT ROUTE
    else if (req.url === "/about" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>About Our Restaurant</h1>");
    }

    // MENU ROUTE USING FS
    else if (req.url === "/menu" && req.method === "GET") {
        fs.readFile("public/menu.html", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error reading menu file");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    }

    // POST ADD FOOD
    else if (req.url === "/add-food" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const newFood = JSON.parse(body);

                if (
                    newFood.id === undefined ||
                    !newFood.foodName ||
                    !newFood.category ||
                    typeof newFood.price !== "number" ||
                    typeof newFood.availability !== "boolean"
                ) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        message: "Missing or invalid fields"
                    }));
                }

                foods.push(newFood);

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Food added successfully",
                    food: newFood
                }));

            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Invalid JSON"
                }));
            }
        });
    }

    // INVALID ROUTE
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Page Not Found");
    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});