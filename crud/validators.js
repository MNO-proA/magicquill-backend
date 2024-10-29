import { z } from "zod";

const userValidator = z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

const contentValidator = z.object({
    userId: z.number().positive("User ID must be positive"),
    content: z.string().min(1, "Content cannot be empty"),
    prompt: z.string().min(1, "Prompt cannot be empty"),
    content_type: z.string()
        .min(1, "Content type must be specified")
        .max(50, "Content type cannot exceed 50 characters"),
});

const todoValidator = z.object({
    userId: z.number().positive("User ID must be positive"),
    todo_content: z.string().min(1, "Todo content cannot be empty"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string(),
});

const todoUpdateValidator = z.object({
    todo_content: z.string().min(1, "Todo content cannot be empty").optional(),
    completed: z.boolean().optional(),
});

async function validateData(schema, data) {
    try {
        const validData = await schema.parseAsync(data);
        return {
            success: true,
            data: validData,
            message: "Validation successful",
        };
    } catch (error) {
        const errors = error.errors.map(err => err.message).join(", ");
        return {
            success: false,
            data: {},
            message: errors,
        };
    }
}

export const validateUser = (data) => validateData(userValidator, data);
export const validateContent = (data) => validateData(contentValidator, data);
export const validateTodo = (data) => validateData(todoValidator, data);
export const validateTodoUpdate = (data) => validateData(todoUpdateValidator, data);
