const btn_pick = document.getElementById("btn_pick");
const btn_exp = document.getElementById("btn_exp");
const btn_clear = document.getElementById("btn_clear");
const all_colors = document.querySelector(".all_colors");


let selectedColors = JSON.parse(localStorage.getItem("color-list")) || [];

function copyToClipboard(s) {
  navigator.clipboard
    .writeText(s)
    .then(() => alert(`Copied ${s} !`))
    .catch((e) => alert("Failed to copy!"));
}

const displayColors = () => {
  all_colors.innerHTML = selectedColors
    .map(
      (
        color,
        i
      ) => `<div key=${i} class="color_box" style="display:flex; justify-content:center;align-items:center;gap:10px; width:150px; ">
            <span class="color" style="background: ${color}; width: 30px; height:30px;display:block;"></span>
            <div class="color_info" style="display:flex;
            flex-direction: column; justify-content:center;align-items:center;">
            <span id="color_hex" style="width: 100px;hover:scale: 1.04">${color}</span>
            <span id="color_rgb" style="width: 100px">${toRGB(color)}</span>
            </div>
    </div>`
    )
    .join("");
};


all_colors.addEventListener("click",(e)=>{
    const colorHex=e.target.closest("#color_hex");
    const colorRgb=e.target.closest("#color_rgb");
    if(colorRgb) copyToClipboard(colorRgb.textContent);
    else if(colorHex) copyToClipboard(colorHex.textContent);
})

const toRGB = (hex) => {
  const int = parseInt(hex.slice(1), 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgb(${r},${g},${b})`;
};

const eyeDropper = async () => {
  document.body.style.display = "none";
  const { sRGBHex } = await new EyeDropper().open();
  if (!selectedColors.includes(sRGBHex)) {
    selectedColors.push(sRGBHex);
    localStorage.setItem("color-list", JSON.stringify(selectedColors));
  }
  displayColors();
  document.body.style.display = "block";

};

function exportColors(){
    const text=selectedColors.join("\n");
    const blob=new Blob([text],{type: "text/plain"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download="SavedColors.txt";
    link.click();
    URL.revokeObjectURL(url);
    link=null;
}

const clear = () => {
  selectedColors = [];
  localStorage.removeItem("color-list");
  displayColors();
};

btn_pick.addEventListener("click", eyeDropper);
btn_clear.addEventListener("click", clear);
btn_exp.addEventListener("click",exportColors);

displayColors();
