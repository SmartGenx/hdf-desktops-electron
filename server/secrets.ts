import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const PORT: string = process.env.PORT || '5050';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'bvhdbvsbvjksbksvvns';
