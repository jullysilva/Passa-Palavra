function initTimer(){
    console.log('iniciou o timer');

    setTimeout(function() {
        console.log('finalizou o timer');
    }, 2 * 60000)
}