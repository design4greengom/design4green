const targetDiv = document.getElementById("back-map");
const btn = document.getElementById("btn-map");
var bool = false
btn.onclick = function () {
    bool = !bool
  if (bool || targetDiv.style.display === "none") {
   btn.style.width = "30%"
   btn.style.height = "20%"
   btn.style.position ="inital"
   targetDiv.style.display = "block"
  } else {
   btn.style.width="20%"
   btn.style.height = "20%"
   btn.style.position ="initial"
   targetDiv.style.display = "none"
  }
};




