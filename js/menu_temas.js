function criarMenuTemas()
{
   if (localStorage.getItem('DADOS')) {
      DB = JSON.parse(localStorage.getItem('DADOS'))
  }
   let iterator = 0
  for ( var key in DB )
  {
      console.log(key)
      var opcao = document.createElement('BUTTON');
      opcao.id = iterator+1;
      opcao.innerHTML = key;
      opcao.className = "btn btn-info w-25 mt-25";
      opcao.style = "margin: 10px";
      opcao.setAttribute('onClick', "router('themeSelection', '"+key+"')");
      console.log(opcao)
      document.getElementById('menu-container').appendChild(opcao);
      iterator += 1
   }
}