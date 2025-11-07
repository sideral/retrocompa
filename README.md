# RetroCompa 2025 - Sistema de Votaciones

Sistema de votación para la fiesta RetroCompa 2025. Permite a los invitados votar por el mejor disfraz y el mejor karaoke.

## Stack Tecnológico

- Next.js 15 (App Router)
- React 18
- TypeScript
- Supabase (Base de datos)
- Tailwind CSS
- shadcn/ui components

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Crea las siguientes tablas:

#### Tabla `families`
```sql
create table families (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### Tabla `guests`
```sql
create table guests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  family_id uuid references families(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### Tabla `votes`
```sql
create table votes (
  id uuid default gen_random_uuid() primary key,
  voter_id uuid references guests(id) on delete cascade unique,
  costume_vote_1 uuid references guests(id) on delete cascade,
  costume_vote_2 uuid references guests(id) on delete cascade,
  costume_vote_3 uuid references guests(id) on delete cascade,
  karaoke_vote uuid references families(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

3. Copia `.env.example` a `.env.local` y completa las variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo para el script de seed)

### 3. Poblar la base de datos

```bash
npm run seed
```

Este script lee `names.txt` y crea las familias e invitados en Supabase.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura de Páginas

- `/` - Página de inicio
- `/select-guest` - Selección de invitado
- `/vote-costume` - Votación de mejor disfraz (3 votos)
- `/vote-karaoke` - Votación de mejor karaoke (1 voto)
- `/review` - Revisión y confirmación de votos
- `/confirmation` - Página de confirmación
- `/winners` - Página secreta de resultados (solo organizadores)

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno en la configuración de Vercel
3. Despliega

## Notas

- Los invitados que ya votaron no aparecen en la lista de selección
- La página `/winners` es pública pero con URL secreta
- El diseño está optimizado para móviles con estética retro 70s/80s

