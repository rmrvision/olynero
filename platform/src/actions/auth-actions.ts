'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';

/** Next.js throws redirect as an error; we must rethrow so redirect actually happens */
function isRedirectError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'digest' in error) {
        const digest = (error as { digest?: string }).digest;
        return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT');
    }
    return false;
}

const RegisterSchema = z.object({
    name: z.string().min(1, 'Имя обязательно'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

const LoginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(1, 'Пароль обязателен'),
});

const UpdateProfileSchema = z.object({
    name: z.string().min(1, 'Имя не может быть пустым').max(100),
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

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'Пользователь с таким email уже существует' };
        }

        const identiconUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(email)}`;

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image: identiconUrl,
            },
        });

        return { success: 'Аккаунт создан!' };
    } catch (error) {
        console.error("[Auth Action] Registration error:", error);
        return { error: "Ошибка при регистрации." };
    }
}

export async function login(formData: FormData) {
    const validatedFields = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { error: 'Некорректные данные' };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/dashboard',
        });
    } catch (error) {
        // NextAuth redirects by throwing; do not treat as failure
        if (isRedirectError(error)) throw error;
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Неверный email или пароль!' };
                default:
                    return { error: 'Что-то пошло не так!' };
            }
        }
        throw error;
    }
}

export async function loginWithGithub() {
    await signIn("github", { redirectTo: "/dashboard" });
}

export async function updateProfile(name: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const validated = UpdateProfileSchema.safeParse({ name });
    if (!validated.success) {
        return { error: validated.error.issues[0]?.message || "Некорректные данные" };
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { name: validated.data.name },
        });
        return { success: "Профиль обновлён" };
    } catch (error) {
        console.error("[Auth Action] Update profile error:", error);
        return { error: "Не удалось обновить профиль" };
    }
}

export async function deleteAccount() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        // Cascade delete will remove projects, files, messages, actions, accounts, sessions
        await db.user.delete({
            where: { id: session.user.id },
        });
        return { success: "Аккаунт удалён" };
    } catch (error) {
        console.error("[Auth Action] Delete account error:", error);
        return { error: "Не удалось удалить аккаунт" };
    }
}
