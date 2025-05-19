// import * as React from "react";
// import { FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Box } from "@mui/material";

// // const roles = ["Admin", "User", "Editor", "Viewer"];
// const roles = [
//     {
//         "value": 1,
//         "label": "Administrador"
//     },
//     {
//         "value": 6,
//         "label": "Bodeguero"
//     },
//     {
//         "value": 4,
//         "label": "Cliente"
//     },
//     {
//         "value": 3,
//         "label": "Conductor"
//     },
//     {
//         "value": 7,
//         "label": "Despachador"
//     },
//     {
//         "value": 2,
//         "label": "Mecánico"
//     },
//     {
//         "value": 9,
//         "label": "Subarrendatario"
//     },
//     {
//         "value": 8,
//         "label": "Transportador"
//     }

// ]

// export default function RoleSelect() {
//     const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
//     const [focused, setFocused] = React.useState(false);

//     const handleChange = (event: any) => {
//         setSelectedRoles(event.target.value);
//         console.log(selectedRoles);
//     };

//     return (
//         <FormControl fullWidth variant="outlined">
//             <InputLabel
//                 id="role-select-label"
//                 shrink
//                 style={{
//                     color: focused ? '#000000' : 'gray',
//                     fontWeight: 'bolder',
//                 }}
//             >Roles</InputLabel>
//             <Select
//                 labelId="role-select-label"
//                 multiple
//                 notched
//                 value={selectedRoles}
//                 onChange={handleChange}
//                 size="small"
//                 input={<OutlinedInput label="Roles" />}
//                 renderValue={(selected) => (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {(selected as string[]).map((value) => (
//                             <Chip key={value} label={value} />
//                         ))}
//                     </Box>
//                 )}
//                 onFocus={() => setFocused(true)}
//                 onBlur={() => setFocused(false)}
//             >
//                 {roles.map((role) => (
//                     <MenuItem key={role.value} value={role.label}> 
//                         {role.label}
//                     </MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
//     );
// };


// //CASIII
// import * as React from "react";
// import { FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Box, SelectChangeEvent } from "@mui/material";

// interface RoleSelectProps {
//     options: { value: number; label: string }[]; // Definimos la estructura de las opciones
//     selectedRoles: string[]; // Prop para los roles seleccionados
//     // onChange: (roles: string[]) => void; // Función para manejar el cambio
//     onChange: (event: SelectChangeEvent<string>) => void; 
// }

// const RoleSelect: React.FC<RoleSelectProps> = ({ options, selectedRoles, onChange }) => {
//     const [focused, setFocused] = React.useState(false);

//     // const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//     //     const value = event.target.value as string[];
//     //     onChange(value); // Llamamos a la función onChange pasada como prop
//     // };

//     return (
//         <FormControl fullWidth variant="outlined">
//             <InputLabel
//                 id="role-select-label"
//                 shrink
//                 style={{
//                     color: focused ? '#000000' : 'gray',
//                     fontWeight: 'bolder',
//                 }}
//             >Roles</InputLabel>
//             <Select
//                 labelId="role-select-label"
//                 multiple
//                 notched
//                 value={selectedRoles}
//                 onChange={onChange}
//                 size="small"
//                 input={<OutlinedInput label="Roles" />}
//                 renderValue={(selected) => (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {(selected as string[]).map((value) => (
//                             <Chip key={value} label={value} />
//                         ))}
//                     </Box>
//                 )}
//                 onFocus={() => setFocused(true)}
//                 onBlur={() => setFocused(false)}
//             >
//                 {options.map((role) => (
//                     <MenuItem key={role.value} value={role.label}> 
//                         {role.label}
//                     </MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
//     );
// };

// export default RoleSelect;



import * as React from "react";
import { FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Box, SelectChangeEvent } from "@mui/material";

interface RoleSelectProps {
    // options: { value: number; label: string }[]; // Definimos la estructura de las opciones
    options: { value: string | number; label: string }[]; // Array de opciones
    value: string[]; // Prop para los roles seleccionados
    onChange: (event: SelectChangeEvent<string[]>) => void; // Función para manejar el cambio
    required?: boolean;
    size?: 'small' | 'medium'; // Tamaño del select
    valorname?: string;
    bloqueado?: boolean;
    label: string;
}

const SelectMultiple: React.FC<RoleSelectProps> = ({ options, value, onChange, required = false, size = 'small', valorname, bloqueado, label }) => {
    const [focused, setFocused] = React.useState(false);

    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel
                id="role-select-label"
                shrink
                style={{
                    color: focused ? '#000000' : 'gray',
                    fontWeight: 'bolder',
                }}
            >{label}</InputLabel>
            <Select
                labelId="role-select-label"
                multiple
                notched
                value={value}
                onChange={onChange}
                input={<OutlinedInput
                    label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {/* {(selected as string[]).map((label) => (
                            <Chip key={label} label={label} />
                        ))} */}
                        {(selected as string[]).map((val) => {
                            const option = options.find((o) => o.value === val);
                            return <Chip key={val} label={option?.label || val} />;
                        })}
                    </Box>
                )}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                variant="outlined"
                size={size}
                name={valorname}
                disabled={bloqueado}
                required={required}
            >
                {options.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                        {role.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectMultiple;
