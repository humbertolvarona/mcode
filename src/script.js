document.addEventListener("DOMContentLoaded", () => {
  const dataInput = document.getElementById("dataInput");
  const codeTypeSelector = document.getElementById("codeTypeSelector");
  const generateButton = document.getElementById("generateButton");
  const outputContainer = document.getElementById("outputContainer");
  const downloadButton = document.getElementById("downloadButton");
  const errorMessageDiv = document.getElementById("errorMessage");

  let generatedCodeElement = null;
  let currentCodeType = "";
  let currentData = "";

  generateButton.addEventListener("click", generateCode);
  downloadButton.addEventListener("click", downloadCodeImage);

  function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = "block";
    outputContainer.innerHTML = "";
    downloadButton.style.display = "none";
    generatedCodeElement = null;
  }

  function clearError() {
    errorMessageDiv.textContent = "";
    errorMessageDiv.style.display = "none";
  }

  function generateJsBarcode(svgElement, data, formatOptions) {
    try {
      JsBarcode(svgElement, data, {
        lineColor: "#000",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        margin: 10,
        ...formatOptions,
      });
      generatedCodeElement = svgElement;
      downloadButton.style.display = "block";
    } catch (error) {
      console.error("JsBarcode Error:", error);
      displayError(
        `Error al generar ${formatOptions.format || "código de barras"}: ${
          error.message
        }. Verifique los datos ingresados.`
      );
      if (svgElement && svgElement.parentElement) {
        svgElement.parentElement.removeChild(svgElement);
      }
      generatedCodeElement = null;
    }
  }

  function generateCode() {
    clearError();
    outputContainer.innerHTML = "";
    downloadButton.style.display = "none";
    generatedCodeElement = null;

    const data = dataInput.value.trim();
    currentData = data;
    const codeType = codeTypeSelector.value;
    currentCodeType = codeType;

    if (!data) {
      displayError("El campo de contenido no puede estar vacío.");
      return;
    }

    if (codeType === "qr") {
      const qrCodeDiv = document.createElement("div");
      outputContainer.appendChild(qrCodeDiv);

      try {
        new QRCode(qrCodeDiv, {
          text: data,
          width: 256,
          height: 256,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        generatedCodeElement =
          qrCodeDiv.querySelector("canvas") || qrCodeDiv.querySelector("img");

        if (generatedCodeElement) {
          downloadButton.style.display = "block";
        } else {
          displayError(
            "No se pudo generar el Código QR. Intente con un texto más corto o simple."
          );
        }
      } catch (error) {
        console.error("QRCode.js Error:", error);
        displayError(`Error al generar Código QR: ${error.message}.`);
        if (qrCodeDiv && qrCodeDiv.parentElement) {
          qrCodeDiv.parentElement.removeChild(qrCodeDiv);
        }
        generatedCodeElement = null;
      }
    } else {
      const svgElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgElement.id = "barcode_svg_output";
      outputContainer.appendChild(svgElement);

      let barcodeOptions = {};

      switch (codeType) {
        case "code128":
          barcodeOptions.format = "CODE128";
          break;
        case "ean13":
          if (!/^\d{12,13}$/.test(data)) {
            displayError("EAN-13 requiere 12 o 13 dígitos numéricos.");
            if (svgElement.parentElement)
              svgElement.parentElement.removeChild(svgElement);
            return;
          }
          barcodeOptions.format = "EAN13";
          break;
        case "code39":
          barcodeOptions.format = "CODE39";
          break;
        case "upca":
          if (!/^\d{11,12}$/.test(data)) {
            displayError("UPC-A requiere 11 o 12 dígitos numéricos.");
            if (svgElement.parentElement)
              svgElement.parentElement.removeChild(svgElement);
            return;
          }
          barcodeOptions.format = "UPC";
          break;
        case "ean8":
          if (!/^\d{7,8}$/.test(data)) {
            displayError("EAN-8 requiere 7 u 8 dígitos numéricos.");
            if (svgElement.parentElement)
              svgElement.parentElement.removeChild(svgElement);
            return;
          }
          barcodeOptions.format = "EAN8";
          break;
        case "itf":
          if (!/^\d+$/.test(data) || data.length % 2 !== 0) {
            displayError("ITF requiere un número par de dígitos numéricos.");
            if (svgElement.parentElement)
              svgElement.parentElement.removeChild(svgElement);
            return;
          }
          barcodeOptions.format = "ITF";
          break;
        case "msi":
          if (!/^\d+$/.test(data)) {
            displayError(
              "MSI (Modified Plessey) requiere solo dígitos numéricos."
            );
            if (svgElement.parentElement)
              svgElement.parentElement.removeChild(svgElement);
            return;
          }
          barcodeOptions.format = "MSI";
          break;
        case "codabar":
          if (!/^[0-9A-D\-\$\:\/\.\+]+$/i.test(data)) {
            displayError(
              "Codabar contiene caracteres no válidos. Usar 0-9, A-D, -, $, :, /, ., +"
            );
            if (svgElement.parentElement)
              svgElement.parentElement.removeChild(svgElement);
            return;
          }
          barcodeOptions.format = "CODABAR";
          break;
        default:
          displayError("Tipo de código seleccionado no es válido.");
          if (svgElement.parentElement)
            svgElement.parentElement.removeChild(svgElement);
          return;
      }

      generateJsBarcode(svgElement, data, barcodeOptions);
    }
  }

  function downloadCodeImage() {
    if (!generatedCodeElement || !currentData) {
      displayError(
        "No hay código generado para descargar o falta el dato original."
      );
      return;
    }

    const safeFilenameData = currentData
      .substring(0, 25)
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    let filename = `${currentCodeType}_${
      safeFilenameData || "codigo_generado"
    }`;
    let dataUrl = "";

    if (currentCodeType === "qr") {
      if (generatedCodeElement.tagName === "CANVAS") {
        dataUrl = generatedCodeElement.toDataURL("image/png");
        filename += ".png";
      } else if (generatedCodeElement.tagName === "IMG") {
        if (
          generatedCodeElement.src &&
          generatedCodeElement.src.startsWith("data:image")
        ) {
          dataUrl = generatedCodeElement.src;
          const mimeType =
            generatedCodeElement.src.match(/data:(image\/[^;]+);/);
          if (mimeType && mimeType[1] === "image/svg+xml") {
            filename += ".svg";
          } else {
            filename += ".png";
          }
        } else {
          const canvas = document.createElement("canvas");
          canvas.width =
            generatedCodeElement.naturalWidth ||
            generatedCodeElement.width ||
            256;
          canvas.height =
            generatedCodeElement.naturalHeight ||
            generatedCodeElement.height ||
            256;
          const ctx = canvas.getContext("2d");
          try {
            ctx.drawImage(
              generatedCodeElement,
              0,
              0,
              canvas.width,
              canvas.height
            );
            dataUrl = canvas.toDataURL("image/png");
            filename += ".png";
          } catch (e) {
            console.error("Error dibujando imagen en canvas para descarga:", e);
            displayError("Error al preparar la imagen QR para descarga.");
            return;
          }
        }
      } else {
        displayError("Elemento de Código QR no reconocido para descarga.");
        return;
      }
    } else {
      if (
        generatedCodeElement.tagName === "svg" ||
        generatedCodeElement.tagName === "SVG"
      ) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(generatedCodeElement);
        dataUrl =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
        filename += ".svg";
      } else {
        displayError(
          "Elemento de código de barras no reconocido para descarga (se esperaba SVG)."
        );
        return;
      }
    }

    if (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      displayError("No se pudo preparar el archivo para la descarga.");
    }
  }
});
