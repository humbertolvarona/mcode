# Barcode & QR Code Generator – Functional Documentation

## Website available at

[https://code-hlvarona.pages.dev](https://code-hlvarona.pages.dev)

---

## Overview

This web application enables users to generate barcodes and QR codes from custom data. The user-friendly interface supports multiple barcode formats, instant code rendering, and downloading of generated codes as image files.

---

## Main Features

### 1. Data Input

* Users can enter any text, URL, number, or string in the input field to encode as a barcode or QR code.
* Input validation ensures the data matches the selected code type requirements.

### 2. Code Type Selection

* A dropdown menu allows users to select the type of code to generate:

  * QR Code
  * Barcode (Code128)
  * Barcode (EAN-13)
  * Barcode (Code39)
  * Barcode (UPC-A)
  * Barcode (EAN-8)
  * Barcode (ITF)
  * Barcode (MSI)
  * Barcode (Codabar)

### 3. Code Generation

* Upon clicking the **Generate Code** button, the application creates and displays the code in the output section.
* Instant feedback is provided if the data is invalid or the code cannot be generated.

### 4. Error Handling

* Clear error messages are displayed for invalid input, unsupported code types, or failed code generation attempts.

### 5. Download Functionality

* Users can download the generated barcode or QR code as an image by clicking the **Download Image** button.
* The button is visible only when a code has been successfully generated.

### 6. Responsive Interface

* The application is fully responsive, adapting to desktop and mobile devices.
* The interface provides clear instructions and feedback for a seamless user experience.

---

## License

This project is licensed under the MIT License. See details below.

Copyright (c) 2024 HL Varona

---

**Author:** HL Varona

**Email:** [humberto.varona@gmail.com](mailto:humberto.varona@gmail.com)
