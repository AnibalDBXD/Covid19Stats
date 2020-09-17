"use strict";

const buttonCountry = document.getElementById ('searchButton');
const inputCountry = document.getElementById('myInput');
const table = document.getElementById('table');
const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

buttonCountry.addEventListener('click', () => {
  const selectCountry = inputCountry.value;
  const rowToScrollTo = document.getElementById(selectCountry);
  rowToScrollTo.classList.add('focus');
  const DOM = document.getElementsByTagName('html');
  DOM[0].scrollTop = rowToScrollTo.offsetTop;
});


async function getNameCountry() {
  let countryList = [];
  await fetch("https://api.covid19api.com/countries", requestOptions)
      .then(response => response.text())
      .then(result => {
          const json = JSON.parse(result)
          for (let i = 0; i < json.length; i++) {
              countryList.push(json[i].Country);
          }
      })
      .catch(error => console.log('error', error));
  return countryList;
};

async function getData(){
  let json = [];
  await fetch("https://api.covid19api.com/summary", requestOptions)
    .then(response => response.text())
    .then(result => json = JSON.parse(result))
    .catch(error => console.log('error', error));
  return json;
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

function setInformationOnHTML(content) {
  let name;
  let tagTR = document.createElement('tr');
  let tagTD_Name = document.createElement('td');
  let tagTD_Cases = document.createElement('td');
  let tagTD_NewCases = document.createElement('td');
  let tagTD_Deaths = document.createElement('td');
  let tagTD_NewDeaths = document.createElement('td');
  let tagTD_Recovered = document.createElement('td');
  if(content.Country){
    name = document.createTextNode(content.Country);
    tagTD_Name.id = content.Country;
  }else{
    name = document.createTextNode("Global");
  }

  const cases = document.createTextNode(content.TotalConfirmed);
  const newCases = document.createTextNode(content.NewConfirmed);
  const deaths = document.createTextNode(content.TotalDeaths);
  const newDeaths = document.createTextNode(content.NewDeaths);
  const recovered = document.createTextNode(content.TotalRecovered);

  tagTD_Name.appendChild(name);
  tagTD_Cases.appendChild(cases);
  tagTD_NewCases.appendChild(newCases);
  tagTD_Deaths.appendChild(deaths);
  tagTD_NewDeaths.appendChild(newDeaths);
  tagTD_Recovered.appendChild(recovered);

  tagTR.appendChild(tagTD_Name);
  tagTR.appendChild(tagTD_Cases);
  tagTR.appendChild(tagTD_NewCases);
  tagTR.appendChild(tagTD_Deaths);
  tagTR.appendChild(tagTD_NewDeaths);
  tagTR.appendChild(tagTD_Recovered);

  table.appendChild(tagTR);
}

getData().then((result) => {
  setInformationOnHTML(result.Global);
  for (let i = 0; i < result.Countries.length; i++) {
    setInformationOnHTML(result.Countries[i])
  }
}).catch(() =>{
  debugger
  const title = document.getElementsByClassName('title');
  title[0].classList.add('hide')
  const caching = document.getElementsByClassName('chaching');
  caching[0].classList.remove('hide')
})


getNameCountry().then((result) =>{
    autocomplete(inputCountry, result)
});


