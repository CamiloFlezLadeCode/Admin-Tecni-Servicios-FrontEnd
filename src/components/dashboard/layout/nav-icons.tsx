import type { Icon } from '@phosphor-icons/react/dist/lib/types';
// import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
// import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
// import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
// import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
// import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
// import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
// import { SquareHalf } from '@phosphor-icons/react/dist/ssr/SquareHalf';
// import { ArrowCircleRight } from '@phosphor-icons/react/dist/ssr/ArrowCircleRight'; 
// import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr/ArrowCircleLeft'; 
// import { Detective } from '@phosphor-icons/react/dist/ssr/Detective'; 
// import { CurrencyDollar } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';

import {
  ChartPie as ChartPieIcon,
  GearSix as GearSixIcon,
  PlugsConnected as PlugsConnectedIcon,
  User as UserIcon,
  Users as UsersIcon,
  XSquare,
  SquareHalf,
  ArrowCircleRight,
  ArrowCircleLeft,
  Detective,
  CurrencyDollar,
  ReadCvLogo,
  FileText, //Representa la gestión de documentos o informes.
  ChartPie, //Ideal para representar análisis o informes de gestión.
  Clipboard, //Puede simbolizar tareas, listas o gestión de proyectos.
  Package, //Representa paquetes o productos, adecuado para gestionar envíos y devoluciones.
  Swap, //Ideal para representar el intercambio de productos o mercancías.
  CaretDown,
  CraneTower, //Ideal para representar maquinaria-equipos
  Wrench, //Ideal para representar equipos, herramientas
  Nut, //Ideal para representar repuestos
  Kanban, //Ideal para representar gestión de proyectos
  Money, //Billete
  CurrencyDollarSimple, //Signo de peso normal
  UsersFour, //Múltiples usuarios
  PencilSimple, //Lapiz para representar editar
  Truck, //Camión
  Lockers, //Referencia a bodega
  ClipboardText, //Hace referencia a ordenes de servicio
  Crown, //Hace referencia a alto rango, máximo nivel
  Receipt, //Hace referencia al estado de cuenta de los clientes
  HouseLine, //Hace referencia al menú inicial
  Info, //Hace referencia a acerca de ó aobut
} from '@phosphor-icons/react/dist/ssr';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'square-half': SquareHalf,
  'arrow-circle-right': ArrowCircleRight,
  'arrow-circle-left': ArrowCircleLeft,
  'detective': Detective,
  'currency-dollar': CurrencyDollar,
  'read-cv-logo': ReadCvLogo,
  'file-text': FileText,
  'icono-equipos': CraneTower,
  'icono-clientes': UsersIcon,
  'icono-mecanicos': Wrench,
  'icono-repuestos': Nut,
  'icono-proyectos': Kanban,
  'icono-precio1': CurrencyDollarSimple,
  'icono-precio2': CurrencyDollar,
  'icono-precio3': Money,
  'usuarios-generales': UsersFour,
  'icono-editar': PencilSimple,
  'icono-vehiculos': Truck,
  'icono-bodegas': Lockers,
  'icono-ordenes-de-servicio': ClipboardText,
  'icono-configuraciones-alto-nivel': Crown,
  'icono-estado-de-cuenta-cliente': Receipt,
  home: HouseLine,
  user: UserIcon,
  users: UsersIcon,
  about: Info
} as Record<string, Icon>;
