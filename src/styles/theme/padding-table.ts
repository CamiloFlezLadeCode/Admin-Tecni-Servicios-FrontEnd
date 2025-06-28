// tablePaddings.ts
import { SxProps } from '@mui/material';

type PaddingVariant = 'compact' | 'standard' | 'spacious';

const PADDING_VARIANTS: Record<PaddingVariant, SxProps> = {
  compact: { padding: { xs: '4px 6px', md: '6px 8px' } },
  standard: { padding: { xs: '6px 8px', md: '8px 12px' } },
  spacious: { padding: { xs: '8px 12px', md: '12px 16px' } }
};

// Elige el estilo activo (cambia solo esta línea)
const ACTIVE_PADDING: PaddingVariant = 'compact'; // ← Modifica aquí para cambiar globalmente

// Exporta directamente el estilo seleccionado
export const TABLE_PADDING = PADDING_VARIANTS[ACTIVE_PADDING];