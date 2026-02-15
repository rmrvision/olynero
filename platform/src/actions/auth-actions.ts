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
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    try {
        const { email, password, name } = validatedFields.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'Email already exists' };
        }

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: 'Account created!' };
    } catch (error) {
        console.error("Registration error:", error);
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
