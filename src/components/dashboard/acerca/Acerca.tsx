'use client';
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Paper,
    useTheme
} from '@mui/material';
import {
    CircleDashed,
    Eye,
    Subway,
    UsersThree,
    Star,
    DribbbleLogo,
    // Fundador/CEO
    Crown,          // Liderazgo
    Sword,          // Visionario
    Lightning,      // Innovador
    Rocket,         // Emprendedor
    Trophy,         // Logros

    // Creatividad
    Palette,        // Diseño
    Code,           // Desarrollo
    Brain,          // Estrategia
    PuzzlePiece,    // Soluciones

    // Profesional
    UserCircle,     // Perfil
    IdentificationCard, // Identidad
    Briefcase,      // Ejecutivo
    GraduationCap,  // Experiencia

    // Tecnología
    Cpu,            // Technical
    Circuitry,      // Sistemas
    Atom,           // Innovación
    GearSix,    // Ajuste

} from '@phosphor-icons/react/dist/ssr';

export function Acerca(): React.JSX.Element {
    const theme = useTheme();

    const creadores = [
        {
            nombre: 'Luis Fernando Salazar Sossa',
            cargo: 'Creador',
            imagen: '/assets/Creador-Luis-Fernando-Salazar-Sossa.jpg',
            habilidades: ['Mecánico'],
            icono: <Crown size={24} />
        },
        {
            nombre: 'José Rodolfo Vargas Montoya',
            cargo: 'Creador',
            imagen: '/assets/Creador-Jose-Rodolfo-Vargas-Montoya.jpg',
            habilidades: ['Mecánico'],
            icono: <Crown size={24} />
        }
    ];

    const valores = [
        // { icono: <Star size={32} />, titulo: 'Innovación', descripcion: 'Siempre a la vanguardia tecnológica' },
        { icono: <UsersThree size={32} />, titulo: 'Colaboración', descripcion: 'Trabajo en equipo para mejores resultados' },
        { icono: <GearSix size={32} />, titulo: 'Compromiso', descripcion: 'Soluciones que generan impacto real' }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Header */}
            <Box textAlign="center" mb={8}>
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}
                >
                    Acerca de Nosotros
                </Typography>
                {/* <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Creando soluciones tecnológicas innovadoras que transforman negocios y mejoran experiencias
                </Typography> */}
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Reparación, alquiler y transporte de equipos para la construcción
                </Typography>
            </Box>

            {/* Misión y Visión */}
            <Grid container spacing={6} mb={8}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <Box display="flex" alignItems="center" mb={3}>
                            <CircleDashed size={40} color="white" />
                            <Typography variant="h5" component="h2" color="white" ml={2}>
                                Nuestra Misión
                            </Typography>
                        </Box>
                        <Typography variant="body1" color="white" textAlign='justify' lineHeight={1.8}>
                            En TECNISERVICIOS J.F S.A.S, nuestra misión es proporcionar servicios de reparación de equipos industriales de la mejor calidad. Nos comprometemos a minimizar el tiempo de inactividad de su maquinaria y a maximizar su rendimiento.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <Box display="flex" alignItems="center" mb={3}>
                            <Eye size={40} color="white" />
                            <Typography variant="h5" component="h2" color="white" ml={2}>
                                Nuestra Visión
                            </Typography>
                        </Box>
                        {/* <Typography variant="body1" color="white" textAlign='justify' lineHeight={1.8}>
                            Ser reconocidos como líderes en desarrollo de software en Latinoamérica,
                            destacándonos por nuestra innovación, calidad y compromiso con el éxito
                            de nuestros clientes. Aspiramos a expandir nuestro impacto globalmente
                            para 2030.
                        </Typography> */}
                    </Paper>
                </Grid>
            </Grid>

            {/* Valores */}
            <Box mb={8}>
                <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 600 }}>
                    Nuestros Valores
                </Typography>
                <Grid container spacing={4} mt={2}>
                    {valores.map((valor, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card elevation={2} sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                                        {valor.icono}
                                    </Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        {valor.titulo}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {valor.descripcion}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Equipo Creativo */}
            <Box>
                <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 600 }}>
                    Nuestro Equipo
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" mb={4}>
                    Contamos con un equipo de técnicos altamente capacitados y experimentados en la reparación de equipos industriales. Utilizamos herramientas y tecnologías de buena calidad para garantizar un servicio eficiente y efectivo.
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {creadores.map((creador, index) => (
                        <Grid item xs={12} sm={6} md={5} key={index}>
                            <Card elevation={4} sx={{
                                p: 3,
                                textAlign: 'center',
                                background: 'linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)'
                                }
                            }}>
                                <CardContent>
                                    <Avatar
                                        src={creador.imagen}
                                        alt={creador.nombre}
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            mx: 'auto',
                                            mb: 3,
                                            border: `4px solid ${theme.palette.primary.main}`
                                        }}
                                    />

                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        {creador.nombre}
                                    </Typography>

                                    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                        {creador.icono}
                                        <Typography variant="body2" color="primary" ml={1}>
                                            {creador.cargo}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                                        {creador.habilidades.map((habilidad, idx) => (
                                            <Chip
                                                key={idx}
                                                label={habilidad}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: theme.palette.primary.main,
                                                    color: theme.palette.primary.main
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Footer */}
            <Box textAlign="center" mt={8} p={4} sx={{ backgroundColor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Potenciando el éxito en cada proyecto de construcción
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Soluciones integrales en equipos para construcción: reparación especializada, alquiler estratégico y transporte eficiente • 2024
                </Typography>
            </Box>
        </Container>
    );
}