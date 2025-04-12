import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { SquareHalf } from '@phosphor-icons/react/dist/ssr/SquareHalf';
import { ArrowCircleRight } from '@phosphor-icons/react/dist/ssr/ArrowCircleRight'; 
import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr/ArrowCircleLeft'; 
import { Detective } from '@phosphor-icons/react/dist/ssr/Detective'; 

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'square-half': SquareHalf,
  'arrow-circle-right': ArrowCircleRight,
  'arrow-circle-left': ArrowCircleLeft,
  'detective': Detective,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
