# Arquitectura propuesta por módulos clínicos

## Objetivo

Preparar el sistema para crecer con distintos tipos de documentos clínicos y workflows de hospitalización, sin depender del código actual mono-archivo ni de una sola vista central.

## Principio base

Cada área clínica debe tener su propio conjunto de:
- pantalla o vista principal
- formularios específicos
- estado reactivo
- lógica de negocio
- servicios de API
- tipos del dominio
- validaciones y auditoría

## Módulos propuestos

### 1) Pacientes
Responsable de:
- listado de pacientes
- detalle del paciente
- estado de cama
- búsqueda por servicio
- filtros por especialidad

### 2) Notas de enfermería
Responsable de:
- creación y edición de notas
- firma de notas
- historial por paciente
- integración con signos vitales

### 3) Signos vitales
Responsable de:
- carga y visualización de vitales
- historial por paciente/nota
- comparativos de evolución
- validación de rangos clínicos

### 4) SOAPIE
Responsable de:
- estructura subjetivo, objetivo, análisis, plan, intervención, evaluación
- construcción del payload clínico
- guardado con firma y auditoría
- consulta histórica por paciente

### 5) Kardex
Responsable de:
- registro de acciones y evolución diaria
- compartición por turno
- seguimiento de tratamientos
- anotaciones según servicio y paciente

### 6) Balance hídrico
Responsable de:
- ingreso y egreso de líquidos
- total acumulado
- alertas por desbalance
- cálculo diario

### 7) Plan de cuidado
Responsable de:
- NANDA
- NOC
- NIC
- objetivos y intervenciones
- seguimiento por diagnóstico

### 8) Documentación general
Responsable de:
- trazabilidad de documentos emitidos
- versionado y firma
- exportación y archivado
- auditoría clínica

## Estructura recomendada en frontend

```text
src/
  modules/
    pacientes/
      components/
      composables/
      services/
      types/
      views/
    notas/
    vitales/
    soapie/
    kardex/
    balance/
    plan-cuidado/
    documentacion/
```

## Estructura recomendada en backend

```text
backend/src/
  modules/
    pacientes/
      services/
      repositories/
    notas/
      services/
      repositories/
    signos-vitales/
      services/
      repositories/
    soapie/
      services/
      repositories/
    kardex/
      services/
      repositories/
    balance-hidrico/
      services/
      repositories/
    plan-cuidado/
      services/
      repositories/
    documentacion/
      services/
      repositories/
```

## Reglas de diseño

### 1) Un módulo = un dominio clínico
No mezclar la lógica de SOAPIE con la de pacientes ni con la de vitales.

### 2) La vista no debe decidir todo
La vista debe orquestar, pero la lógica real debe vivir en composables o servicios.

### 3) El repositorio debe ocultar SQL
El componente o servicio no debe saber detalles específicos de tablas, columnas y transacciones.

### 4) Los documentos deben tener una base común
Todos los tipos de documento deberían compartir campos como:
- id del paciente
- id de la cuenta o atención
- fecha y hora
- empleado responsable
- firma y estado
- observaciones

### 5) La auditoría es obligatoria
Todo documento clínico debe llevar información de:
- quién lo creó
- quién lo firmó
- cuándo
- en qué servicio se registró

## Cómo empezar en la práctica

### Fase 1
- dejar la base de módulos frontend y backend estabilizada
- mantener compatibilidad con el sistema actual

### Fase 2
- migrar sistema de notas y SOAPIE a un módulo propio
- separar historial de vitales y evolución

### Fase 3
- construir Kardex y balance hídrico con sus propios formularios y validaciones

### Fase 4
- añadir plan de cuidado y NANDA/NOC/NIC con modelos y servicios separados

### Fase 5
- consolidar documentación y firma digital / auditoría clínica

## Beneficios esperados

- menos acoplamiento
- más velocidad de desarrollo
- más claridad para nuevas áreas clínicas
- mejor soporte para múltiples documentos hospitalarios
- capacidad de evolucionar sin romper la operación actual

## Estado actual del proyecto

La base ya quedó preparada con:
- migración por módulos de backend
- wrappers de compatibilidad para no romper la app actual
- separación de servicios/repositorios
- dashboard frontend más limpio
- estructura base para continuar con módulos clínicos
