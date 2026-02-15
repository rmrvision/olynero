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

type RegisterInput = FormData | { name: string; email: string; password: string };

function getRegisterPayload(input: RegisterInput) {
    if (input instanceof FormData) {
        return {
            name: input.get('name'),
            email: input.get('email'),
            password: input.get('password'),
        }
    }
    return input
}

export async function register(input: RegisterInput) {
    const rawData = getRegisterPayload(input)
    const validatedFields = RegisterSchema.safeParse(rawData);

    if (!validatedFields.success) {
        const msg = validatedFields.error.flatten().formErrors[0] || validatedFields.error.issues[0]?.message;
        return { error: msg || 'Проверьте поля: имя, email и пароль (не менее 6 символов).' };
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

export async function loginWithGithub() {
    await signIn("github", { redirectTo: "/dashboard" });
}
