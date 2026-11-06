# ADR-M001 · Framework y herramienta de construcción del cliente

- Estado: **Confirmado** (React / React Native con Expo y TypeScript consumiendo los endpoints ya implementados; ejecución actual en entorno **LOCAL**, ratificado el 2026-11-05)
- Fecha: 2026-11-05 · Responsable: equipo + titular · Relacionado: MM-006, MM-013, MM-014, MM-016, MM-022, MM-023, DEC-M02

## Contexto
El equipo confirmó React Native para Android. Quedan por decidir la herramienta de construcción (con o sin Expo), el lenguaje y el gestor de paquetes. Las bibliotecas nativas probables (almacenamiento seguro, caché rápida, reconocimiento de texto en el dispositivo) exigen módulos nativos.

## Alternativas
**A:** Expo con *development builds* (módulos nativos permitidos; Expo Go no sirve para ellos). **B:** React Native sin Expo (control total del proyecto Android, más mantenimiento). **C:** Expo gestionado sin módulos nativos (no cubre lo previsto).

## Propuesta (NO ratificada)
**A** con TypeScript estricto; versión exacta de Node, del SDK y del gestor de paquetes fijada al aprobar; sin `latest` (INFM-001). Revisar si surge una dependencia nativa incompatible.

## Consecuencias
Condiciona INFM-001 (setup), ADR-M004 (compilación) y la configuración de `targetSdk` 36 (INFM-004). La versión elegida debe poder apuntar a API 36 (verificar al decidir).

## Criterios de aprobación
- [ ] Equipo valida alcance y costo. - [ ] Se verifica compatibilidad con `targetSdk` 36. - [ ] Se registra fecha y versión de constitución.
