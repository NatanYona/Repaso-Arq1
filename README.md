# 💻 Juego de Drag and Drop — Arquitectura de Ordenadores

Este proyecto es una herramienta interactiva desarrollada con **JavaScript, HTML y CSS** que permite a los estudiantes repasar de forma visual y lúdica los principales conectores, puertos y componentes de una **motherboard** y otros elementos de la **arquitectura básica de un ordenador**.

## 🎮 ¿Cómo funciona?

El juego consiste en arrastrar imágenes de distintos componentes y soltarlas sobre su nombre correspondiente. Cada partida incluye una combinación de respuestas correctas e incorrectas para reforzar el reconocimiento visual y fomentar el aprendizaje.

![Captura del juego](demo.gif) <!-- Agrega una demo animada o captura si querés -->

## 🧠 Contenidos abordados

Actualmente el juego incluye los siguientes elementos:

- Conectores de alimentación:
  - Conector de 24 pines (ATX)
  - Conector de 4/8 pines (CPU)
  - Conector SATA de energía
  - Conector Molex

- Conectores de datos:
  - Conector SATA de datos
  - Conector IDE de datos

- Slots de expansión:
  - Slot PCI
  - Slot PCI Express
  - Slot AGP

- Puertos de entrada/salida:
  - Puerto PS/2
  - Puerto RJ-45 (Ethernet)
  - Puerto Serial (RS-232)
  - Puerto VGA
  - Puerto DVI
  - Puerto de audio 3.5 mm

> ⚙️ Las imágenes se cargan dinámicamente desde un archivo JSON y se adaptan automáticamente al contenedor con preservación de la relación de aspecto.

## 🚀 Cómo usar

1. Cloná o descargá este repositorio.

2. Asegurate de tener una estructura como esta:

3. Alojá las imágenes en formato `.webp` en la carpeta `assets/img/` o modificá el JSON para enlazarlas desde un servicio externo (por ejemplo Discord CDN o Cloudinary).

4. Abrí `index.html` en tu navegador.

## 🔧 Tecnologías utilizadas

- HTML5
- CSS3 (flexbox, media queries)
- JavaScript (DOM, drag and drop API)
- Tipografía: Montserrat (Google Fonts)

## 🧑‍🏫 Pensado para

Este proyecto fue desarrollado en el marco de la materia **Arquitectura de Ordenadores** con fines **educativos**. Está especialmente diseñado para estudiantes de carreras técnicas, ingeniería, multimedia o informática que necesiten repasar de forma interactiva.

## 📦 Extensiones posibles

- Agregar más componentes como memorias RAM, conectores USB, HDMI, etc.
- Implementar puntuación persistente.
- Modo competitivo o contrarreloj.
- Compatibilidad con pantallas táctiles.

## 👨‍🏫 Autor y colaboradores

- Desarrollado por: [Tu nombre]
- Cátedra: Arquitectura de Ordenadores
- Rol: Ayudante de cátedra

---

Si este proyecto te resultó útil, ¡considerá dejar una estrella ⭐ o contribuir con ideas!

