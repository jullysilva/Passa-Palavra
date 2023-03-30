const initTimer = require('../js/timer');

test('test a', async () => {
    const logSpy = jest.spyOn(global.console, 'log');

    await initTimer();

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith('iniciou o timer');
    expect(logSpy.mock.calls).toContainEqual(['finalizou o timer']);
})