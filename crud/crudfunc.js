import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Users CRUD
export async function createUser({ email, name }) {
    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
            },
        });
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAllUsers(){
    try {
        const users = await prisma.user.findMany()
        return { success: true, data: users};
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getUser(id) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateUser(id, updateData) {
    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: updateData,
        });
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteUser(id) {
    try {
        await prisma.user.delete({
            where: { id: Number(id) },
        });
        return { success: true, message: 'User deleted successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Generated Content CRUD
export async function createContent({ userId, content, prompt, content_type }) {
    try {
        const generatedContent = await prisma.generatedContent.create({
            data: {
                userId,
                content,
                prompt,
                content_type,
            },
        });
        return { success: true, data: generatedContent };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getContent(id) {
    try {
        const content = await prisma.generatedContent.findUnique({
            where: { id: Number(id) },
        });
        return { success: true, data: content };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getUserContent(userId) {
    try {
        const content = await prisma.generatedContent.findMany({
            where: { userId: Number(userId) },
            orderBy: { created_at: 'desc' },
        });
        return { success: true, data: content };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteContent(id) {
    try {
        await prisma.generatedContent.delete({
            where: { id: Number(id) },
        });
        return { success: true, message: 'Content deleted successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Todo CRUD
export async function createTodo({ userId, todo_content, username, email, password }) {
    try {
        const todo = await prisma.todo.create({
            data: {
                userId,
                todo_content,
                username,
                email,
                password,
            },
        });
        return { success: true, data: todo };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getTodo(id) {
    try {
        const todo = await prisma.todo.findUnique({
            where: { id: Number(id) },
        });
        return { success: true, data: todo };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getUserTodos(userId) {
    try {
        const todos = await prisma.todo.findMany({
            where: { userId: Number(userId) },
            orderBy: { created_at: 'desc' },
        });
        return { success: true, data: todos };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateTodo(id, updateData) {
    try {
        const todo = await prisma.todo.update({
            where: { id: Number(id) },
            data: updateData,
        });
        return { success: true, data: todo };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteTodo(id) {
    try {
        await prisma.todo.delete({
            where: { id: Number(id) },
        });
        return { success: true, message: 'Todo deleted successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

