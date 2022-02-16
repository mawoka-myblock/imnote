import { Deta } from 'deta';
import { PrismaClient } from '@prisma/client';
export const deta = Deta(String(import.meta.env.VITE_DETA_KEY));
export const prisma = new PrismaClient();