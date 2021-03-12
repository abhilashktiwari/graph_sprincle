require('./site/index.html');
require('./site/style.css');

global.DEBUG = false;

const url = 'ws://localhost:8011/stomp';
const client = Stomp.client(url);
client.debug = function (msg) {
  if (global.DEBUG) {
    console.info(msg);
  }
};

function connectCallback() {
  document.getElementById('stomp-status').innerHTML =
    'It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs.';
}

const Ticker = require('./es6/Ticker');
const TEMPLATE = `
<div class="company-bid-values">
    <div id="bid-company-{name}" class="bid-company">{name}</div>
    <div id="company-bestAsk-{name}" class="company-bestAsk">{bestAsk}</div>
    <div id="company-bestBid-{name}" class="company-bestBid">{bestBid}</div>
    <div id="company-openAsk-{name}" class="company-openAsk">{openAsk}</div>
    <div id="company-openBid-{name}" class="company-openBid">{openBid}</div>
    <div id="company-lastChangeAsk-{name}" class="company-lastChangeAsk">{lastChangeAsk}</div>
    <div id="company-lastChangeBid-{name}" class="company-lastChangeBid">{lastChangeBid}</div>
    <div id="company-sparkline-{name}" class="company-sparkline"></div>
</div>`;

const _companyTicker = new Ticker('company-tickers', TEMPLATE, window.document);
client.connect(
  {},
  function connectCallback() {
    client.subscribe(
      '/fx/prices',
      _companyTicker.updateCompany.bind(_companyTicker)
    );
  },
  (error) => alert(error.headers.message)
);
