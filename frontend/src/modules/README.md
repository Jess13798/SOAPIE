# Módulos del frontend

Este directorio está pensado para crecer con una estructura por dominio clínico y mantener la vista principal más limpia.

## Objetivo
- separar la lógica por módulo
- evitar vistas gigantes con responsabilidades mezcladas
- reutilizar componentes y composables por área clínica
- preparar la app para nuevos documentos y workflows del hospital

## Estado actual

Ya se dejó una base funcional con estas separaciones:

- `Dashboard.vue` reducida a su papel de orquestador visual
- `useDashboard.ts` para la lógica de navegación, títulos y modales
- la estructura de módulos queda abierta para crecer por dominio

## Estructura recomendada

- pacientes/
- notas/
- vitales/
- kardex/
- balance/
- documentacion/

Cada módulo debería contar con:
- vista o pantalla principal
- formularios específicos
- composables de estado
- servicios de API
- tipos del dominio

## Regla de arquitectura

La lógica de negocio no debe vivir mezclada dentro de componentes de presentación. La idea es mantener una separación clara entre:
- capa de presentación
- capa de estado/composable
- capa de servicio HTTP
- dominio clínico

Con esto el proyecto puede crecer hacia SOAPIE, Kardex, balance hídrico, señales vitales y futuros documentos sin romper la base actual.
