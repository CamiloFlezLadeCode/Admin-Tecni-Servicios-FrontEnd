'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { LockKey } from '@phosphor-icons/react/dist/ssr/LockKey';
import { User } from '@phosphor-icons/react/dist/ssr/User';
import { WarningCircle } from '@phosphor-icons/react/dist/ssr/WarningCircle';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Login } from '@/services/login/LoginService'; // Asegúrate de que la ruta sea correcta
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  email: zod.string().min(1, { message: 'El usuario es requerido' }),
  password: zod.string().min(1, { message: 'Contraseña es requerida' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

/** Saludo según la hora local. */
function saludoSegunHora(hora: number): string {
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/** Campo "hundido" en el vidrio de la tarjeta; el foco lo sigue dando el tema. */
const campoVidrioSx = {
  bgcolor: 'var(--glass-inset)',
  borderRadius: '14px',
  transition: 'background-color 0.2s ease',
  '&:hover': { bgcolor: 'var(--glass-hover)' },
  '&:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--glass-hairline)',
  },
} as const;

const iconoCampo = { size: 20, color: 'var(--mui-palette-text-secondary)' } as const;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useUser();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [mayusculasActivas, setMayusculasActivas] = React.useState<boolean>(false);
  const tarjetaRef = React.useRef<HTMLDivElement>(null);
  // El saludo depende de la hora del navegador: se calcula tras montar para no
  // desajustar la hidratación (el servidor no conoce la hora de quien entra).
  const [saludo, setSaludo] = React.useState<string>('Bienvenido');

  React.useEffect(() => {
    setSaludo(saludoSegunHora(new Date().getHours()));
  }, []);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  /**
   * Sacudida de la tarjeta ante un error, como en iOS.
   *
   * Con la Web Animations API y no con una clase CSS: una clase hay que
   * quitarla al terminar (`animationend`) para poder repetirla, y si ese evento
   * no llega la clase se queda pegada y los siguientes errores ya no sacuden.
   */
  const sacudirTarjeta = React.useCallback((): void => {
    const tarjeta = tarjetaRef.current;
    if (!tarjeta || typeof tarjeta.animate !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    tarjeta.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 420, easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)' }
    );
  }, []);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        const { email: NombreUsuario, password: ClaveUsuario } = values;

        const result = await Login({ NombreUsuario, ClaveUsuario });

        if (!result) {
          setError('root', { type: 'server', message: 'Error al iniciar sesión' });
          sacudirTarjeta();
          return;
        }

        if (!result.accesohabilitado) {
          setError('root', { type: 'server', message: 'Usuario inhabilitado' });
          sacudirTarjeta();
          return;
        }

        if (!result.rol) {
          setError('root', { type: 'server', message: 'Error al iniciar sesión' });
          sacudirTarjeta();
          return;
        }

        // Almacenar las credenciales
        localStorage.setItem('custom-auth-rol', result.rol);
        localStorage.setItem('custom-auth-name', result.nombre); // No olvides guardar el nombre
        localStorage.setItem('custom-auth-documento', result.documento);
        localStorage.setItem('custom-auth-correo', result.correo);
        localStorage.setItem('custom-auth-token-autenticacion', result.token);

        document.cookie = `custom-auth-rol=${result.rol}; path=/; max-age=${60 * 60 * 24 * 1}`;

        await checkSession?.();
        router.push('/dashboard');
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error desconocido';
        setError('root', { type: 'server', message: errorMessage });
        sacudirTarjeta();
      } finally {
        setIsPending(false);
      }
    },
    [checkSession, router, setError, sacudirTarjeta]
  );

  // Bloq Mayús es la causa más común de "contraseña incorrecta"
  const detectarMayusculas = (evento: React.KeyboardEvent): void => {
    setMayusculasActivas(evento.getModifierState('CapsLock'));
  };

  return (
    <>
      {/* La entrada va en el contenedor y la sacudida en la tarjeta: ambas usan
          `transform` y en el mismo elemento se pisarían. */}
      <Box className="auth-entrada">
        <Box
          ref={tarjetaRef}
          className="liquid-glass"
          sx={{
            borderRadius: '28px',
            p: { xs: 3, sm: 4 },
            background: 'var(--glass-bg)',
          }}
        >
          <Stack spacing={3.5}>
            <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
              <Box
                component="img"
                src="/assets/LogoCompanyLogoIco.png"
                alt="TecniServicios"
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  objectFit: 'contain',
                  bgcolor: 'common.white',
                  p: 0.75,
                  // Halo del color de marca: el logo "flota" sobre el vidrio
                  boxShadow:
                    '0 0 0 1px var(--glass-hairline), 0 14px 36px -10px rgba(var(--mui-palette-primary-mainChannel) / 0.6)',
                }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {saludo}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--mui-palette-text-secondary)', mt: 0.5 }}>
                  Inicia sesión para continuar en TecniServicios
                </Typography>
              </Box>
            </Stack>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, sacudirTarjeta)}
            >
              <Stack spacing={2}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.email)}>
                      <InputLabel>Usuario</InputLabel>
                      <OutlinedInput
                        {...field}
                        label="Usuario"
                        type="text"
                        autoComplete="username"
                        autoFocus
                        startAdornment={
                          <InputAdornment position="start">
                            <User {...iconoCampo} />
                          </InputAdornment>
                        }
                        sx={campoVidrioSx}
                      />
                      {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.password)}>
                      <InputLabel>Contraseña</InputLabel>
                      <OutlinedInput
                        {...field}
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        onKeyDown={detectarMayusculas}
                        onKeyUp={detectarMayusculas}
                        onBlur={() => {
                          field.onBlur();
                          setMayusculasActivas(false);
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <LockKey {...iconoCampo} />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                              onClick={(): void => {
                                setShowPassword((prev) => !prev);
                              }}
                              onMouseDown={(evento) => {
                                // Evita que el campo pierda el foco al pulsar el ojo
                                evento.preventDefault();
                              }}
                            >
                              {showPassword ? <EyeIcon size={20} /> : <EyeSlashIcon size={20} />}
                            </IconButton>
                          </InputAdornment>
                        }
                        sx={campoVidrioSx}
                      />
                      {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                      {mayusculasActivas ? (
                        <FormHelperText
                          sx={{ color: 'var(--mui-palette-warning-main)', display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          <WarningCircle size={14} weight="fill" /> Bloq Mayús está activado
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
                {errors.root ? (
                  <Alert color="error" severity="error" sx={{ borderRadius: '14px' }}>
                    {errors.root.message}
                  </Alert>
                ) : null}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isPending}
                  endIcon={isPending ? null : <ArrowRight size={18} weight="bold" />}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    mt: 0.5,
                    py: 1.4,
                    borderRadius: '14px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    // Píldora con brillo, igual que el ítem activo del sidebar
                    background:
                      'linear-gradient(180deg, rgba(255 255 255 / 0.2) 0%, rgba(255 255 255 / 0) 55%), var(--mui-palette-primary-main)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255 255 255 / 0.35), 0 12px 28px -10px rgba(var(--mui-palette-primary-mainChannel) / 0.8)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    // Destello que cruza el botón al pasar el cursor
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: '45%',
                      background: 'linear-gradient(90deg, transparent, rgba(255 255 255 / 0.35), transparent)',
                      transform: 'translateX(-120%) skewX(-20deg)',
                      pointerEvents: 'none',
                    },
                    '&:hover': {
                      background:
                        'linear-gradient(180deg, rgba(255 255 255 / 0.2) 0%, rgba(255 255 255 / 0) 55%), var(--mui-palette-primary-main)',
                      transform: 'translateY(-1px)',
                      boxShadow:
                        'inset 0 1px 0 rgba(255 255 255 / 0.35), 0 16px 32px -10px rgba(var(--mui-palette-primary-mainChannel) / 0.9)',
                    },
                    '&:hover::after': { animation: 'auth-destello 0.9s ease' },
                    '&:active': { transform: 'scale(0.98)' },
                    '&.Mui-disabled': {
                      color: 'var(--mui-palette-primary-contrastText)',
                      opacity: 0.8,
                    },
                  }}
                >
                  {isPending ? (
                    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                      <CircularProgress size={18} thickness={5} color="inherit" />
                      <span>Ingresando…</span>
                    </Stack>
                  ) : (
                    'Ingresar'
                  )}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Box>

      <Box
        className="liquid-glass"
        sx={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          borderRadius: '999px',
          px: 2,
          py: 0.75,
          background: 'var(--glass-bg)',
          whiteSpace: 'nowrap',
          maxWidth: 'calc(100% - 32px)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'var(--mui-palette-text-secondary)', fontWeight: 500 }}>
          © {new Date().getFullYear()}{' '}
          <Box
            component="a"
            href="https://camiloflezlade.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'var(--mui-palette-primary-main)', fontWeight: 700, textDecoration: 'none' }}
          >
            FlezLade Softworks
          </Box>
          . Todos los derechos reservados.
        </Typography>
      </Box>
    </>
  );
}
