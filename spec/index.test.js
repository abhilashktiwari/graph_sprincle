const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Ticker = require('../es6/Ticker');
const Sparkline = require('../site/sparkline');

const TEMPLATE = `<div id="company-id-{name}">
<div class="company-bid-values">
    <div id="bid-company-{name}">{name}</div>
    <div id="company-bestAsk-{name}">{bestAsk}</div>
    <div id="company-bestBid-{name}">{bestBid}</div>
    <div id="company-openAsk-{name}">{openAsk}</div>
    <div id="company-openBid-{name}">{openBid}</div>
    <div id="company-lastChangeAsk-{name}" >{lastChangeAsk}</div>
    <div id="company-lastChangeBid-{name}" >{lastChangeBid}</div>
    <div id="company-sparkline-{name}"></div>
</div></div>`;

describe('class Ticker', () => {
  let App;
  const dom = new JSDOM(
    `'<!doctype html><html><body>
      <div id="company-tickers"></div>
      </body></html>`
  );
  const document = dom.window.document;

  beforeEach(() => {
    App = new Ticker('company-tickers', TEMPLATE, document);
  });

  test('initVariables', () => {
    expect(typeof App.storeObj).toBe('object');
  });

  test('updateCompany UI and sorts row', () => {
    const data = {
      body:
        '{"name":"gbpcad","bestBid":1.8600257150436224,"bestAsk":1.901847151956841,"openBid":1.8201712457721382,"openAsk":1.840428754227862,"lastChangeAsk":0.10404159488544185,"lastChangeBid":0.13830905554562323}',
    };
    App.updateCompany(data, true);
    expect(App.storeObj.companies.size).toBe(1);

    const data2 = {
      body:
        '{"name":"gbpjpy","bestBid":1.24,"bestAsk":2.22,"openBid":1.8201712457721382,"openAsk":1.840428754227862,"lastChangeAsk":0.10404159488544185,"lastChangeBid":6}',
    };
    App.updateCompany(data2, true);
    expect(App.storeObj.companies.size).toBe(2);
  });

  test('getSparksArray should return an Array', () => {
    let arr = App.getSparksArray('test', 2.22, new Map());
    expect(arr.length).toBeGreaterThan(0);
  });
});

describe('assignNameAndValues', () => {
  const data = {
    name: 'gbpcad',
    bestBid: 1.8600257150436224,
    bestAsk: 1.901847151956841,
    openBid: 1.8201712457721382,
    openAsk: 1.840428754227862,
    lastChangeAsk: 0.10404159488544185,
    lastChangeBid: 0.13830905554562323,
  };
  test('template placeholders should compile', () => {
    const source = TEMPLATE.assignNameAndValues(data);
    const error = source
      .split('<div id')
      .reduce(
        (accum, val) =>
          val !== '' && !val.includes(data.name) ? [...accum, val] : accum,
        []
      );

    expect(error.length).toBe(0);
  });
});
