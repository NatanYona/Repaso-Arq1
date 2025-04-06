# 🎮 Juego de Drag and Drop — Arquitectura de Ordenadores I

Este proyecto es una herramienta interactiva desarrollada con **JavaScript**, **HTML** y **CSS** que permite a los estudiantes repasar de forma visual y lúdica los principales conectores, puertos y componentes de una motherboard y otros elementos de la arquitectura básica de un ordenador.

---

## 🕹️ ¿Cómo funciona?

El juego consiste en **arrastrar imágenes** de distintos componentes y **soltarlas sobre su nombre correspondiente**. Cada partida incluye una combinación de respuestas correctas e incorrectas para reforzar el reconocimiento visual y fomentar el aprendizaje.

---

## 🧠 Contenidos abordados

Actualmente el juego incluye los siguientes elementos:

### 🔌 Conectores de alimentación:
- Conector de 24 pines (ATX)
- Conector de 4/8 pines (CPU)
- Conector SATA de energía
- Conector Molex

### 💾 Conectores de datos:
- Conector SATA de datos
- Conector IDE de datos

### 📦 Slots de expansión:
- Slot PCI
- Slot PCI Express
- Slot AGP

### 🖧 Puertos de entrada/salida:
- Puerto PS/2
- Puerto RJ-45 (Ethernet)
- Puerto Serial (RS-232)
- Puerto VGA
- Puerto DVI
- Puerto de audio 3.5 mm

---

## ⚙️ Funcionamiento técnico

- Las imágenes se cargan dinámicamente desde un archivo **JSON**.
- Se adaptan automáticamente al contenedor con **preservación de la relación de aspecto**.
- Se utilizan técnicas de **Drag and Drop** nativas del DOM.

---

## 🚀 Cómo usar

1. Cloná o descargá este repositorio.
   
2. Asegurate de tener una estructura como esta:
```
assets/
│ ├── img/ ← imágenes en formato .webp
│ ├── data/
│ └── brands.json ← archivo con los datos dinámicos
│ index.html style.css main.js
```
3. Alojá las imágenes en la carpeta `assets/img/` o modificá el JSON para enlazarlas desde un servicio externo (por ejemplo, Discord CDN o Cloudinary).
   
4. Abrí `index.html` en tu navegador.

---

## 📱 Responsive design

El proyecto cuenta con diseño responsive que:
- Se adapta a pantallas de celulares y tablets mediante **media queries**.
- Ajusta el layout de los ítems arrastrables y las zonas de dropeo.
- Mantiene la legibilidad de etiquetas y botones sin perder funcionalidad.

Podés usar este juego tanto desde una PC como desde un smartphone.

---

## 🛠 Tecnologías utilizadas

- HTML5
- CSS3 (flexbox, media queries)
- JavaScript (DOM, drag and drop API)
- Tipografía: [Montserrat](https://fonts.google.com/specimen/Montserrat) (Google Fonts)

---

## 👤 Sobre mí

Soy **Natán Yona**, **Desarrollador FullStack** con experiencia en el desarrollo de aplicaciones web utilizando tecnologías modernas. Cuento con **certificación como desarrollador web FullStack** y actualmente soy **ayudante de cátedra** en la materia **Arquitectura de Ordenadores I**, donde busco aplicar mis conocimientos para crear herramientas educativas interactivas que hagan más dinámico el aprendizaje.

Me interesa especialmente combinar tecnología y educación para generar experiencias útiles, visuales y accesibles para estudiantes de carreras técnicas.

---

## 🧑‍🏫 Pensado para

Este proyecto fue desarrollado en el marco de la materia **Arquitectura de Ordenadores I** con fines educativos. Está especialmente diseñado para estudiantes de carreras técnicas, ingeniería, multimedia o informática que necesiten repasar de forma interactiva.

---

## 📦 Extensiones posibles

- Agregar más componentes como memorias RAM, conectores USB, HDMI, etc.
- Implementar puntuación persistente.
- Modo competitivo o contrarreloj.
- Compatibilidad con pantallas táctiles.
- Accesibilidad para estudiantes con dificultades visuales.

---

## 👨‍🏫 Autor y colaboradores

- **Desarrollado por**: Natán Yona
- **Cátedra**: Arquitectura de Ordenadores I
- **Rol**: Ayudante de cátedra

Si este proyecto te resultó útil, ¡considerá dejar una estrella ⭐ o contribuir con ideas!

---

📬 ¡Gracias por visitar este repositorio!
