import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

export const metadata = { title: `Clientes | ${config.site.name}` } satisfies Metadata;

// Datos de ejemplo de la plantilla: [número, nombre, usuario de correo, teléfono, ciudad, país, estado, calle]
const datosEjemplo: [string, string, string, string, string, string, string, string][] = [
  ['010', 'Alcides Antonio', 'alcides.antonio', '908-691-3242', 'Madrid', 'Spain', 'Comunidad de Madrid', '4158 Hedge Street'],
  ['009', 'Marcus Finn', 'marcus.finn', '415-907-2647', 'Carson City', 'USA', 'Nevada', '2188 Armbrester Drive'],
  ['008', 'Jie Yan', 'jie.yan.song', '770-635-2682', 'North Canton', 'USA', 'Ohio', '4894 Lakeland Park Drive'],
  ['007', 'Nasimiyu Danai', 'nasimiyu.danai', '801-301-7894', 'Salt Lake City', 'USA', 'Utah', '368 Lamberts Branch Road'],
  ['006', 'Iulia Albu', 'iulia.albu', '313-812-8947', 'Murray', 'USA', 'Utah', '3934 Wildrose Lane'],
  ['005', 'Fran Perez', 'fran.perez', '712-351-5711', 'Atlanta', 'USA', 'Georgia', '1865 Pleasant Hill Road'],
  ['004', 'Penjani Inyene', 'penjani.inyene', '858-602-3409', 'Berkeley', 'USA', 'California', '317 Angus Road'],
  ['003', 'Carson Darrin', 'carson.darrin', '304-428-3097', 'Cleveland', 'USA', 'Ohio', '2849 Fulton Street'],
  ['002', 'Siegbert Gottfried', 'siegbert.gottfried', '702-661-1654', 'Los Angeles', 'USA', 'California', '1798 Hickory Ridge Drive'],
  ['001', 'Miron Vitold', 'miron.vitold', '972-333-4106', 'San Diego', 'USA', 'California', '75247'],
];

const customers = datosEjemplo.map(([numero, name, usuario, phone, city, country, state, street]) => ({
  id: `USR-${numero}`,
  name,
  avatar: `/assets/avatar-${Number(numero)}.png`,
  email: `${usuario}@devias.io`,
  phone,
  address: { city, country, state, street },
  createdAt: dayjs().subtract(2, 'hours').toDate(),
})) satisfies Customer[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5" style={{fontWeight: 'bold'}}>Clientes</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Importar
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Exportar
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
