# BackOffice EPICO

## Descripción
**BackOffice EPICO** proporciona al usuario una herramienta para la gestión de las diferentes opciones que disponen los portales de EPICO. Este sistema centraliza y optimiza el mantenimiento y la administración de funcionalidades clave como catálogos, centros de emprendimiento, bolsas de empleo, y más.

## Tecnologías Utilizadas
- **Framework:** Angular 18
- **Lenguaje:** TypeScript
- **Gestor de Paquetes:** npm (Node Package Manager)

## Instalación y Configuración

### Requisitos Previos
- **Node.js** (incluye npm): Asegúrate de tener Node.js instalado en tu sistema. Puedes descargarlo [aquí](https://nodejs.org/).

### Pasos para la instalación
1. Clona este repositorio en tu máquina local:
	```bash
	git clone https://github.com/epicoguayaquil/bolsaempleo-frontend.git
2. Navega a la raiz del proyecto
	```bash
	\ce-workspace
3. Instala las dependencias necesarias ejecutando el siguiente comando:
	```bash
	npm install
	
## Estructura del WorkSpace
El Marco de Trabajo (workspace) de **BackOffice EPICO** consta de varios proyectos, cada uno enfocado en diferentes áreas funcionales:

- **bo-mnt-catalogos:** Mantenimiento de los catálogos de EPICO.
- **bo-srv-centroemprendimiento:** Gestión de las opciones del portal del Centro de Emprendimiento.
- **bo-srv-empleo:** Mantenimiento de las opciones relacionadas con la Bolsa de Empleo.
- **centro-emprendimiento:** BackOffice que integra el mantenimiento de todos los portales de EPICO.
- **centroemprendimiento-lib:** Componentes reutilizables compartidos entre los portales y aplicaciones del workspace.
- **environments:** Configuraciones específicas del entorno (producción, desarrollo, pruebas).
- **portal:** Portal de publicación de ofertas laborales, eventos, y servicios de EPICO.

## Cómo contribuir a este proyecto
Aquí hay 2 pasos rápidos y sencillos para contribuir a este proyecto:

* Identifica la tarea a solucionar, localizada en la pestaña **Issues**
* Añade tu nombre al archivo `CONTRIBUTORS.md`

¡Haz una solicitud de extracción (pull request) para tu trabajo y espera a que sea fusionada!

## ¡Empezamos!
* Haz un fork de este repositorio (Haz clic en el botón Fork en la parte superior derecha de esta página)
* Clona tu fork en tu máquina local

```markdown
git clone https://github.com/epicoguayaquil/bolsaempleo-frontend.git
```

* Crea una rama

```markdown
git checkout -b dev/nombre-de-la-rama
```

* Haz tus cambios (elige cualquiera de las tareas en la pestaña **Issues**)
* Haz commit y push

```markdown
git add .
git commit -m 'Mensaje del commit'
git push origin dev/nombre-de-la-rama
```

* Crea una nueva solicitud de extracción desde tu repositorio forkeado (Haz clic en el botón `New Pull Request` ubicado en la parte superior de tu repositorio)
* ¡Espera la revisión de tu PR y la aprobación de la fusión!
* __¡Dale una estrella a este repositorio__ si te ha gustado!

## Agrega tu nombre al listado de contribuidores
### 1. Añade tu nombre
Añade tu nombre al archivo `CONTRIBUTORS.md` usando la siguiente convención:

```markdown
#### Nombre: [TU NOMBRE](Enlace de GitHub)
- Lugar: Ciudad, Estado, País
- Bio: ¿Quién eres?
- GitHub: [Nombre de cuenta de GitHub](Enlace de GitHub)
```
