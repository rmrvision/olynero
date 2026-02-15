'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const RegisterSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export async function register(formData: FormData) {
    console.log("[Auth Action] Register called");
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    };
    console.log("[Auth Action] Raw data received:", { ...rawData, password: '***' });

    const validatedFields = RegisterSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error("[Auth Action] Validation failed:", validatedFields.error);
        return { error: 'Invalid fields' };
    }

    try {
        const { email, password, name } = validatedFields.data;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("[Auth Action] Password hashed");

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.warn("[Auth Action] User already exists:", email);
            return { error: 'Email already exists' };
        }

        console.log("[Auth Action] Creating user in DB...");
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        console.log("[Auth Action] User created successfully:", newUser.id);

        return { success: 'Account created!' };
    } catch (error) {
        console.error("[Auth Action] Registration error:", error);
        return { error: "Something went wrong during registration." };
    }
}

export async function login(formData: FormData) {
    const validatedFields = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/chat',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials!' };
                default:
                    return { error: 'Something went wrong!' };
            }
        }
        throw error;
    }
}
