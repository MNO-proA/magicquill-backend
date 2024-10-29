import express from 'express';
import {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    createContent,
    getContent,
    getUserContent,
    deleteContent,
    createTodo,
    getTodo,
    getUserTodos,
    updateTodo,
    deleteTodo,
} from './crud/crudfunc.js'; 
import {
    validateUser,
    validateContent,
    validateTodo,
    validateTodoUpdate,
} from './crud/validators.js'; 
// import { clerkClient, requireAuth } from '@clerk/express'
import 'dotenv/config'
import {automateTwitterPost}  from './automate/twitterAutomation.js';
import cors from 'cors';


const app = express();
const port = 3000;

// app.use(requireAuth({ apiKey: process.env.CLERK_SECRET_KEY }))
app.use(express.json());

// CORS setup
app.use(cors({
    origin: 'http://localhost:5173',  // Allow your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow preflight and other methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  }));

app.options('*', cors()); // Enable pre-flight requests for all routes




app.post('/api/post-tweet', async (req, res) => {
    const { content, credentials } = req.body;

    console.log('Content Type:', typeof content); // Check type
    console.log('Content Value:', content); // Check actual value
    console.log(credentials);
    
    try {
        const response = await automateTwitterPost(credentials, content);
        res.json({ success: response });
    } catch (error) {
        console.error('Twitter automation failed:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to post tweet' 
        });
    }
});

// app.get('/protected', async (req, res) => {
//   const { userId } = req.auth
//   try {
//     const user = await clerkClient.users.getUser(userId)
//   return res.json({ user })
//   } catch (error) {
//     console.log(error)
//   }
  
// })

// User Routes
app.post('/users', async (req, res) => {
    const validation = await validateUser(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.message });
    }

    const { email, name } = req.body;
    const result = await createUser({ email, name });
    return res.status(result.success ? 201 : 500).json(result);
});

app.get('/users', async (req, res) => {
  const result = await getAllUsers();
  return res.status(result.success ? 200 : 404).json(result);
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getUser(id);
    return res.status(result.success ? 200 : 404).json(result);
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const validation = await validateUser(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.message });
    }

    const result = await updateUser(id, req.body);
    return res.status(result.success ? 200 : 404).json(result);
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteUser(id);
    return res.status(result.success ? 200 : 404).json(result);
});

// Generated Content Routes
app.post('/contents', async (req, res) => {
    const validation = await validateContent(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.message });
    }

    const { userId, content, prompt, content_type } = req.body;
    const result = await createContent({ userId, content, prompt, content_type });
    return res.status(result.success ? 201 : 500).json(result);
});

app.get('/contents/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getContent(id);
    return res.status(result.success ? 200 : 404).json(result);
});

app.get('/users/:userId/contents', async (req, res) => {
    const { userId } = req.params;
    const result = await getUserContent(userId);
    return res.status(result.success ? 200 : 404).json(result);
});

app.delete('/contents/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteContent(id);
    return res.status(result.success ? 200 : 404).json(result);
});

// Todo Routes
app.post('/todos', async (req, res) => {
    const validation = await validateTodo(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.message });
    }

    const { userId, todo_content, username, email, password } = req.body;
    const result = await createTodo({ userId, todo_content, username, email, password });
    return res.status(result.success ? 201 : 500).json(result);
});

app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getTodo(id);
    return res.status(result.success ? 200 : 404).json(result);
});

app.get('/users/:userId/todos', async (req, res) => {
    const { userId } = req.params;
    const result = await getUserTodos(userId);
    return res.status(result.success ? 200 : 404).json(result);
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const validation = await validateTodoUpdate(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.message });
    }

    const result = await updateTodo(id, req.body);
    return res.status(result.success ? 200 : 404).json(result);
});

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteTodo(id);
    return res.status(result.success ? 200 : 404).json(result);
});

app.get('/', async (req, res) => { 
    res.send(<h1>Hello, Welcome to MagicQuill Core!</h1>)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
