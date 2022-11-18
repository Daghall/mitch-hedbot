"use strict";

const article = document.getElementsByTagName("article")[0];
const main = document.getElementsByTagName("main")[0];
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const search = window.location.search
  .slice(1)
  .split("&")
  .concat("extended=true")
  .filter(Boolean)
  .join("&");
const uri = `https://cakytfxd3jpjszq5jkuvccznry0fshea.lambda-url.us-east-1.on.aws/?${search}`;

window.fetch(uri).then(async (response) => {
  const { quote, index } = JSON.parse(await response.text());

  prev.href = `?index=${index - 1}`;
  next.href = `?index=${index + 1}`;

  article.innerHTML = quote.replace(/_([^_]+)_/g, "<i>$1</i>");
  main.classList.remove("hidden");

  const margin = (1 - (article.offsetHeight / window.innerHeight)) * 20;
  if (margin > 4) {
    main.style.marginTop = `${margin}vw`;
  }
}).catch((error) => {
  console.error(error); // eslint-disable-line no-console
});
