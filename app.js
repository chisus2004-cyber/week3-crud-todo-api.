require('dotenv').config(); 

const express = require('express');


const app = express();

//body parser middleware
app.use(express.json());

let todos =  [
{ id: 1, task: 'Learn Node.js', completed: false },
{ id: 2, task: 'build CRUD API', completed: false },
];

// GET /todos - Get all items
app.get('/todos/', (req, res) => {
    res.status(200).json(todos); // send array as JSON
});

// Array bonus: must come BEFORE /todos/:id
app.get('/todos/active', (req, res) => {
  res.status(200).json(todos.filter(t => !t.completed));
});

// Single read
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo);
});

app.post('/todos', (req, res) => {
    if (!req.body.task || typeof req.body.task !== 'string' || !req.body.task.trim()) {
  return res.status(400).json({ error: '"task" field is required' });
}
    const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
    todos.push(newTodo);
    res.status(201).json(newTodo); //Echo back
});


// PATCH Update - Partial
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id)); // array.find()
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    Object.assign(todo, req.body); // Merge: e.g. { completed: true }
    res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id); // array.filter() - non-destructive
    if (initialLength === todos.length) {
        return res.status(404).json({ error: 'not found' });
    }
    res.status(204).send(); // silent success
});

app.use((err, req, res, next) => 
    res.status(500).json({ error: 'something went wrong!' }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`APP is running on port ${PORT}`);
});