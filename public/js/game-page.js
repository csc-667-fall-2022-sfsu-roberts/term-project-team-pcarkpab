let leaveButton = document.getElementById("leave-game");

leaveButton.onclick = () => {
  let pathname = window.location.pathname;
  const pathnameSegments = pathname.split('/');
  const lastElement = pathnameSegments.pop();
  fetch(`/api/lobby/leave/${lastElement}`, {method: "post"})
  .then((result) => {
    return result.json();
  })
  .then((result_json) => {
    if(result_json.success){
      window.location.href = "/auth/lobby";
    }
  })
  .catch(err => console.log(err));
}