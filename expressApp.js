const express = require('express');

const app = express();

app.use(express.json());

let foods = [
    { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
    { id: 2, foodName: "Burger", category: "Fast Food", price: 120, availability: true },
    { id: 3, foodName: "Coffee", category: "Beverage", price: 100, availability: false }
];

// GET ALL FOODS
app.get('/foods', (req, res) => {
    res.status(200).json(foods);
});

// GET FOOD BY ID
app.get('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const food = foods.find(f => f.id === id);

    if (!food) {
        return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json(food);
});

// POST ADD FOOD
app.post('/foods', (req, res) => {
    const newFood = req.body;

    if (
        newFood.id === undefined ||
        !newFood.foodName ||
        !newFood.category ||
        typeof newFood.price !== "number" ||
        newFood.price <= 0 ||
        typeof newFood.availability !== "boolean"
    ) {
        return res.status(400).json({ message: "Invalid food details" });
    }

    if (foods.some(f => f.id === Number(newFood.id))) {
        return res.status(400).json({ message: "ID already exists" });
    }

    foods.push(newFood);

    res.status(201).json({
        message: "Food item added successfully",
        food: newFood
    });
});

// PUT UPDATE FOOD
app.put('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = foods.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Food not found" });
    }

    const updatedFood = {
        ...foods[index],
        ...req.body,
        id: foods[index].id
    };

    if (
        !updatedFood.foodName ||
        !updatedFood.category ||
        typeof updatedFood.price !== "number" ||
        updatedFood.price <= 0 ||
        typeof updatedFood.availability !== "boolean"
    ) {
        return res.status(400).json({ message: "Invalid food details" });
    }

    foods[index] = updatedFood;

    res.status(200).json({
        message: "Food updated successfully",
        food: updatedFood
    });
});

// DELETE FOOD
app.delete('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = foods.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Food not found" });
    }

    const deletedFood = foods.splice(index, 1);

    res.status(200).json({
        message: "Food deleted successfully",
        food: deletedFood[0]
    });
});

// INVALID ROUTE
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// INVALID JSON ERROR HANDLER
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({ message: "Invalid JSON" });
    }
    next(err);
});

// START SERVER
app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});