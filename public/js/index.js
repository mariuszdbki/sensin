prepareSymbolList();

async function prepareSymbolList() {
  let result = await fetch('/symbols');
  let html = await result.text();
  document.querySelector('#symbols').innerHTML = html;
}

