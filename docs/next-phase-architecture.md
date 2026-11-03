# Siguiente fase de arquitectura

## Objetivo

Preparar el proyecto para crecer con múltiples áreas clínicas, documentos y formularios distintos, sin depender del modelo actual de la base de datos.

## Base común

Se define un conjunto de entidades reutilizables:
- paciente
- atención
- servicio
- empleado
- documento clínico
- diagnóstico
- intervención
- resultado
- firma y auditoría

## Módulos propuestos

### Backend
- auth
- pacientes
- atenciones
- notas
- signos-vitales
- kardex
- balance-hidrico
- plan-cuidado
- documentos

### Frontend
- pacientes
- notas
- vitales
- kardex
- balance
- documentos

## Regla de diseño

Cada módulo debe tener:
- rutas o endpoints
- controlador
- servicio
- repositorio
- validación
- mapeo de datos

Esto reduce acoplamiento y permite añadir nuevos formatos sin romper el sistema.

## Qué no se hace todavía

No se propone un rediseño de esquemas de base de datos en esta fase. La prioridad es la estructura de dominio y la separación de capas.

## Resultado esperado

- menos acoplamiento
- más reutilización
- posibilidad de crear documentos nuevos más rápido
- mejor soporte para NANDA / NOC / NIC, Kardex y otros formatos clínicos
