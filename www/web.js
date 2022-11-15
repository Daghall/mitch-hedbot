"use strict";

const search = window.location.search;
const uri = `https://cakytfxd3jpjszq5jkuvccznry0fshea.lambda-url.us-east-1.on.aws/${search}`;

window.fetch(uri).then(async (response) => {
  const article = document.getElementsByTagName("article")[0];
  const main = document.getElementsByTagName("main")[0];
  const margin = (1 - (article.offsetHeight / window.innerHeight)) * 20;

  article.innerHTML = (await response.text()).replace(/_([^_]+)_/g, "<i>$1</i>");

  if (margin > 4) {
    main.style.marginTop = `${margin}vw`;
  }

  main.classList.remove("hidden");
}).catch((error) => {
  console.error(error); // eslint-disable-line no-console
});
