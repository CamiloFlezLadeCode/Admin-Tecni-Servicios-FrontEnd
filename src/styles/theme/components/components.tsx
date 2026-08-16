import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';
import { MuiAvatar } from './avatar';
import { MuiButton } from './button';
import { MuiCard } from './card';
import { MuiCardContent } from './card-content';
import { MuiCardHeader } from './card-header';
import { MuiAlert, MuiChip, MuiIconButton, MuiListItemIcon } from './feedback';
import {
  MuiAutocomplete,
  MuiCheckbox,
  MuiFormHelperText,
  MuiFormLabel,
  MuiInputLabel,
  MuiOutlinedInput,
  MuiRadio,
  MuiSelect,
} from './inputs';
import { MuiLink } from './link';
import { MuiPaper } from './paper';
import { MuiStack } from './stack';
import {
  MuiBackdrop,
  MuiDialog,
  MuiDialogActions,
  MuiDialogTitle,
  MuiDivider,
  MuiDrawer,
  MuiMenu,
  MuiMenuItem,
  MuiPopover,
  MuiSkeleton,
  MuiTooltip,
} from './surfaces';
import { MuiTab } from './tab';
import { MuiTableBody } from './table-body';
import { MuiTableCell } from './table-cell';
import { MuiTableHead } from './table-head';
import { MuiTableContainer, MuiTablePagination, MuiTableRow, MuiTableSortLabel } from './table';

export const components = {
  MuiAlert,
  MuiAutocomplete,
  MuiAvatar,
  MuiBackdrop,
  MuiButton,
  MuiCard,
  MuiCardContent,
  MuiCardHeader,
  MuiCheckbox,
  MuiChip,
  MuiDialog,
  MuiDialogActions,
  MuiDialogTitle,
  MuiDivider,
  MuiDrawer,
  MuiFormHelperText,
  MuiFormLabel,
  MuiIconButton,
  MuiInputLabel,
  MuiLink,
  MuiListItemIcon,
  MuiMenu,
  MuiMenuItem,
  MuiOutlinedInput,
  MuiPaper,
  MuiPopover,
  MuiRadio,
  MuiSelect,
  MuiSkeleton,
  MuiStack,
  MuiTab,
  MuiTableBody,
  MuiTableCell,
  MuiTableContainer,
  MuiTableHead,
  MuiTablePagination,
  MuiTableRow,
  MuiTableSortLabel,
  MuiTooltip,
} satisfies Components<Theme>;
