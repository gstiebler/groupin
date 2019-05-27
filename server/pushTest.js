const pushService = require('./src/lib/pushService');

pushService.init();
pushService.pushMessage('5bc3ca99342fcfec653e240f', { teste: 'teste' });
