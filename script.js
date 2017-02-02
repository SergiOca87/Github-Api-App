"use strict";


document.getElementById("submit").addEventListener("click", getAUser);


  function getAUser(e) {
  //Prevents form submission, we are using a form simply so the user can press the enter key
  e.preventDefault;

  /* show the user-wrap section and get the value in the input text,
    with this value we create the templates used in the request queries to the Github API */
  document.querySelector(".user-wrap").style.display = "block";
  let searchValue = document.getElementById("search").value;
  let searchParameter = `https://api.github.com/users/${searchValue}`
  let repoSearchParameter = `https://api.github.com/users/${searchValue}/repos`
  const repoList = document.getElementById("repo-list");

  //Clears the input for the user to perform a new search
  document.getElementById("search").value = "";

/* Using this request to retrieve the user information(login, fullName, avatar and bio)*/
  const request = new XMLHttpRequest();
   
  request.onload = outputResponse;
  request.open('get', searchParameter, true)
  request.send()

  function outputResponse() {
    const image = document.getElementById("avatar");
    const userInfo = document.querySelector(".user-info");
    let responseObj = JSON.parse(this.responseText);
    
    /* If a user does not exist, we get "message: Not Found" back. If that's the case, we show an error message to the user
    Also just hides everything else. */
    if (responseObj.message === "Not Found"){
      userInfo.innerHTML = `<h3 class="user-not-found"> Does not exist </h3>`;
      image.style.display = "none";
      repoList.style.display = "none";

      /* If message does not exist in the response... */ 
      } else {
        // Show and set the avatar image 
        image.style.display = "block";
        image.src = responseObj.avatar_url;
       
        //Creates a template to be inserted in the user-info div
        let userInfoTemplate = `
            <p class ="username">  <i> @${responseObj.login} </i> </p>
            <h1 class ="full-name"> ${responseObj.name} </h1>
            <p class ="bio"> ${responseObj.bio} </p>
           `;
      
         // Inser the template into the ".user-info" parent div
        userInfo.innerHTML = userInfoTemplate;

        /* Checks if the user has written a bio or not and if it returns null display a message to the user */ 
    if (responseObj.bio === null) {
      document.querySelector(".bio").textContent = "The user has not written a bio yet."
    }
   } 
  }
 

 
  /* Using this second request to get the repository list */
  const request2 = new XMLHttpRequest();
  request2.onload = secondOutputResponse;
  request2.open('get', repoSearchParameter, true)
  request2.send()


  function secondOutputResponse() {

    repoList.style.display = "block";
    let responseObj = JSON.parse(this.responseText);


  if (responseObj.message === "Not Found"){
    repoList.style.display = "none";
  }

    const list = document.getElementById("list");

    /* Deletes the previous content inside the ul before appending the new ones for every search
    Otherwise the new search gets appended after the last search  */
    list.innerHTML = "";

     /* Create as many li's as number of repos */
    for (let i = 0; i < responseObj.length; i++) {
     const li = document.createElement("LI");
     /*
     li.addClass.("in-li");
*/
      /* Template for the LI*/ 
      li.innerHTML = `<a href= ${responseObj[i].html_url} target="_blank">
       <h3> ${responseObj[i].name} </h3> </a> 
       <span> <i class='fa fa-star' aria-hidden='true'></i> ${responseObj[i].stargazers_count} <i class='fa fa-code-fork' aria-hidden='true'> </i> ${responseObj[i].forks_count} </span>`;

      /* append every li to the list */
      list.appendChild(li);
    }
  }
}
