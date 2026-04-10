# Flight Radar Dashboard

Proyecto de diagnóstico frontend desarrollado con Astro.

## Descripción
Una página web estática que muestra vuelos en vivo usando datos de una API pública ADS-B. Incluye un filtro por país, tarjetas de vuelo con ubicación en Google Maps y modo claro/oscuro.

## Características
- Página principal con al menos 3 secciones: hero, filtro y resultados
- Menú de navegación con `Home` y `About`
- Dark mode / Light mode con toggle
- Animaciones suaves en las tarjetas de vuelo
- Filtro por país con opción `Todos`
- Datos obtenidos usando `fetch` desde `https://api.adsb.lol/v2/lat/0/lon/0/dist/7000`
- Preparado para deploy en Vercel con `vercel.json`

## Tecnologías usadas
- Astro
- Tailwind CSS
- JavaScript vanilla
- HTML semántico
- CSS moderno
