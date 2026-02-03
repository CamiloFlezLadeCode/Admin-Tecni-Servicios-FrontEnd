import { estadoColores } from '@/lib/constants/estadoColores';
import { Estado } from '@/types/estadoColoresType';

export const isEstado = (value: string): value is Estado => {
  return value in estadoColores;
};