# Prototipo Accesible - Expedición de Certificados UdeA

### Diseñado por:
- Elisabeth Gomez Cano.
- Marly Alejandra Ortega Andrade.
- Juan Esteban Pineda Lopera.

## Uso rápido.
Clonar el repositorio. A través de consola, instalar las dependencias y correr localmente el programa con los siguientes comandos:
`npm install`
`npm run dev`

## Mejora de accesibilidad web basada en WCAG 2.1 y Resolución MinTIC 1519 de 2020

Este repositorio contiene un **prototipo accesible** desarrollado como
parte del estudio *"Evaluación de la accesibilidad web en los canales de
la Universidad de Antioquia"*.
El prototipo rediseña la sección de **expedición de certificados**,
seleccionada por su alta utilidad y por las barreras de accesibilidad
detectadas en el análisis con usuarios con discapacidad visual.

------------------------------------------------------------------------

## Objetivo del prototipo

Demostrar cómo **pequeñas mejoras en estructura, etiquetado y manejo del
contenido** pueden incrementar significativamente la accesibilidad para
usuarios que utilizan lectores de pantalla, navegación por teclado o
tecnologías de apoyo.

------------------------------------------------------------------------

## Problemas identificados en la interfaz original

A partir del análisis automatizado y de las entrevistas con usuarios con
discapacidad visual (n = 5), se identificaron los siguientes problemas
principales:

### Botones implementados como imágenes decorativas

-   Los botones de **Consultar trámite** y **Generar certificado**
    estaban construidos con `<img>` y `alt=""`, lo que los hacía
    invisibles para lectores de pantalla.

### Navegación por teclado limitada

-   Párrafos clave no eran *focusable*, por lo que no se podían recorrer
    sin mouse.\
-   Elementos interactivos no anunciaban su función.\
-   Se perdía el foco frecuentemente.

### Incompatibilidad con tecnologías de apoyo

-   Lectores de pantalla no reconocían etiquetas, botones o cambios
    visuales.\
-   Desorientación en los procesos y frustración reportada por los
    usuarios durante el estudio.

------------------------------------------------------------------------

## Mejoras implementadas en el prototipo

El prototipo aborda las barreras anteriores mediante:

### 1. Botones accesibles y semánticos

-   Uso de etiquetas reales como `<button>` o `<a role="button">` con
    texto visible y modificable.
-   Inclusión de atributos `aria-label` cuando es necesario.

### 2. Navegación completa por teclado

-   Todos los elementos clave pueden recibir foco.
-   Orden lógico del foco.
-   Contenido textual completamente navegable sin mouse.

### 3. Compatibilidad con lectores de pantalla

-   Estructura semántica: encabezados, regiones, roles y etiquetas
    correctas.
-   Se evita el uso de imágenes decorativas incorrectas o contenido
    incrustado como imagen.

### 4. Widgets de accesibilidad certificados por WAI

Basados en herramientas recomendadas por la **Web Accessibility
Initiative (WAI)**:

-   Lupa
-   Alto contraste
-   Cambio de brillo
-   Ajuste de tamaño de fuente
-   Regla de lectura
-   Fuente amigable para dislexia
