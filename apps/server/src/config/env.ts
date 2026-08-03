import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().optional(),
  DB_CONNECT_ON_START: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:5174,file://,null'),
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().default('qwen2.5'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.flatten().fieldErrors;
  console.error('Invalid environment variables:', issues);
  process.exit(1);
}

export const env = parsed.data;
export default env;
