import { Deta } from 'deta';
import * as Prisma from '@prisma/client';

// This works in PROD
import { default as ProdPrisma } from '@prisma/client';

let { PrismaClient } = Prisma;
if (!import.meta.env.DEV) PrismaClient = ProdPrisma.PrismaClient;

export const prisma = new PrismaClient();
export const deta = Deta(String(import.meta.env.VITE_DETA_KEY));
