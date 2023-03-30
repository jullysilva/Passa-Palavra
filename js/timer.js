function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initTimer () {
    console.log('iniciou o timer');

    await timeout(1000); //TODO: aumentar tempo para 2 min = 2 * 60000ms

    console.log('finalizou o timer');
}

module.exports = initTimer;
