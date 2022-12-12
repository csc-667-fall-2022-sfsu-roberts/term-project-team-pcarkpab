/*This function allows the user to click the icon to make the
Message on the About Page appear.*/
function messageAppear() {
    var x = document.getElementById("Message");
    if (x.style.display == "grid") {
      x.style.display = "none";
    } else {
      x.style.display = "grid";
    }
  }