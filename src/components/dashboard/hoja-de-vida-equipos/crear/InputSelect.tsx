'use client';
// components/InputSelect.tsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid, SelectChangeEvent } from '@mui/material';

interface InputSelectProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void; // Cambiado a SelectChangeEvent
  options: { value: string; label: string }[]; // Array de opciones
  required?: boolean;
  size?: 'small' | 'medium'; // Tamaño del select
}

const InputSelect: React.FC<InputSelectProps> = ({ label, value, onChange, options, required = false, size = 'small' }) => {
  return (
    <Grid item md={3} xs={12} mt={1}>
      <FormControl fullWidth required={required}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={onChange}
          label={label}
          variant="outlined"
          size={size}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default InputSelect;
