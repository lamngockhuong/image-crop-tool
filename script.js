document.getElementById("imageInput").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = document.getElementById("image");
    img.src = event.target.result;
    img.style.display = "block";
  };
  reader.readAsDataURL(e.target.files[0]);
});

const imageContainer = document.getElementById("imageContainer");
const selection = document.getElementById("selection");
const croppedImage = document.getElementById("croppedImage");
let startX,
  startY,
  endX,
  endY,
  cropData = {};

imageContainer.addEventListener("mousedown", function (e) {
  const rect = imageContainer.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  selection.style.left = startX + "px";
  selection.style.top = startY + "px";
  selection.style.width = "0px";
  selection.style.height = "0px";
  selection.style.display = "block";
});

imageContainer.addEventListener("mousemove", function (e) {
  if (selection.style.display === "block") {
    const rect = imageContainer.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;
    selection.style.width = Math.abs(endX - startX) + "px";
    selection.style.height = Math.abs(endY - startY) + "px";
    selection.style.left = Math.min(startX, endX) + "px";
    selection.style.top = Math.min(startY, endY) + "px";
  }
});

imageContainer.addEventListener("mouseup", function () {
  if (selection.style.display === "block") {
    const rect = selection.getBoundingClientRect();
    const containerRect = imageContainer.getBoundingClientRect();
    const topLeftX = Math.round(rect.left - containerRect.left);
    const topLeftY = Math.round(rect.top - containerRect.top);
    const bottomRightX = Math.round(rect.right - containerRect.left);
    const bottomRightY = Math.round(rect.bottom - containerRect.top);

    const x = Math.round(rect.left - containerRect.left);
    const y = Math.round(rect.top - containerRect.top);
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    cropData = { x, y, width, height };

    document.getElementById(
      "topLeft"
    ).textContent = `Top-Left: (${topLeftX}, ${topLeftY})`;
    document.getElementById(
      "topRight"
    ).textContent = `Top-Right: (${bottomRightX}, ${topLeftY})`;
    document.getElementById(
      "bottomLeft"
    ).textContent = `Bottom-Left: (${topLeftX}, ${bottomRightY})`;
    document.getElementById(
      "bottomRight"
    ).textContent = `Bottom-Right: (${bottomRightX}, ${bottomRightY})`;
    document.getElementById(
      "rectCoords"
    ).textContent = `X: ${x}, Y: ${y}, Width: ${width}, Height: ${height} => Array: ["${x}", "${y}", "${width}", "${height}"]`;

    selection.style.display = "none";
    document.getElementById("cropButton").click();
  }
});

document.getElementById("resetButton").addEventListener("click", function () {
  selection.style.display = "none";
  document.getElementById("rectCoords").textContent = "";
  document.getElementById("topLeft").textContent = "";
  document.getElementById("topRight").textContent = "";
  document.getElementById("bottomLeft").textContent = "";
  document.getElementById("bottomRight").textContent = "";
  cropData = {};
  croppedImage.src = "";
  croppedImage.style.display = "none";
});

document.getElementById("cropButton").addEventListener("click", function () {
  if (cropData.width && cropData.height) {
    const img = document.getElementById("image");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = cropData.width;
    canvas.height = cropData.height;

    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    ctx.drawImage(
      img,
      cropData.x * scaleX,
      cropData.y * scaleY,
      cropData.width * scaleX,
      cropData.height * scaleY,
      0,
      0,
      cropData.width,
      cropData.height
    );

    croppedImage.src = canvas.toDataURL();
    croppedImage.style.display = "inline-block";
  } else {
    alert("Please select a region to crop.");
  }
});
