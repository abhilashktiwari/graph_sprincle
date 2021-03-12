require('./customES6Function');
const Sparkline = require('../site/sparkline');

class Ticker {
  constructor(parentID, template, document) {
    this.storeObj = {};
    this.storeObj.document = document;
    this.storeObj.tickers = this.storeObj.document.querySelector(
      `#${parentID}`
    );
    this.storeObj.companyTemplate = template;
    this.storeObj.companies = new Map();
    this.storeObj.sparks = new Map();
  }

  updateCompany(res, testing = false) {
    const data = JSON.parse(res.body),
      companyName = data.name;
    let companyRow = this.getCompanyRow(companyName);

    if (typeof companyRow === 'undefined') {
      let div = this.storeObj.document.createElement('div');
      div.setAttribute('id', `company-id-${companyName}`);
      div.innerHTML = this.storeObj.companyTemplate.assignNameAndValues(data);
      this.storeObj.tickers.insertBefore(
        div,
        this.firstDiv(this.storeObj.tickers, div)
      );
      companyRow = this.createCompany(this.storeObj.tickers, companyName);
    }
    companyRow = this.updateCompanyDisplay(data, companyRow);
    this.setCompanyRow(companyName, companyRow);

    if (!testing) {
      Sparkline.draw(
        companyRow.sparkline,
        this.getSparksArray(
          companyRow.sparkline.id,
          data.lastChangeBid,
          this.storeObj.sparks
        )
      );
    }
    this.updateParentGridRow(this.storeObj.companies.size);
    this.storeObj.companies = this.sortCompanyGridRowBy(
      'lastChangeBid',
      this.storeObj.companies
    );
  }

  sortCompanyGridRowBy(str, companies) {
    let arr = [];
    for (let i of companies) {
      arr.push(i);
    }

    arr.sort(function (x, y) {
      return y[1][str].innerText - x[1][str].innerText;
    });

    let sorted = arr.reduce((accum, a) => {
      a[1].box.style.gridRow = accum.length + 1;
      return [...accum, a];
    }, []);

    return new Map(sorted);
  }

  updateParentGridRow(count) {
    this.storeObj.tickers.style.gridTemplateRows = `repeat(${count},auto)`;
  }

  getCompanyRow(companyName) {
    return this.storeObj.companies.get(companyName);
  }
  setCompanyRow(companyName, companyData) {
    this.storeObj.companies.set(companyName, companyData);
  }

  getSparksArray(elemId, val, sparks) {
    let currentSpark = sparks.get(elemId);
    if (typeof currentSpark === 'undefined') {
      currentSpark = [0];
      sparks.set(elemId, currentSpark);
    }
    currentSpark.push(val.toFixed(2));
    if (currentSpark.length >= 9) {
      currentSpark.splice(1, 1);
    }
    return currentSpark;
  }

  createCompany(tickers, companyName) {
    let company = {};
    company.box = tickers.querySelector(`#company-id-${companyName}`);
    company.bestAsk = tickers.querySelector(`#company-bestAsk-${companyName}`);
    company.bestBid = tickers.querySelector(`#company-bestBid-${companyName}`);
    company.lastChangeAsk = tickers.querySelector(
      `#company-lastChangeAsk-${companyName}`
    );
    company.lastChangeBid = tickers.querySelector(
      `#company-lastChangeBid-${companyName}`
    );
    company.name = tickers.querySelector(`#bid-company-${companyName}`);
    company.openAsk = tickers.querySelector(`#company-openAsk-${companyName}`);
    company.openBid = tickers.querySelector(`#company-openBid-${companyName}`);
    company.sparkline = tickers.querySelector(
      `#company-sparkline-${companyName}`
    );
    return company;
  }
  updateCompanyDisplay(data, company) {
    company.bestAsk.innerHTML = data.bestAsk.toFixed(4);
    company.bestBid.innerHTML = data.bestBid.toFixed(4);
    company.lastChangeAsk.innerHTML = data.lastChangeAsk.toFixed(4);
    company.lastChangeBid.innerHTML = data.lastChangeBid.toFixed(4);
    company.name.innerHTML = (
      data.name.slice(0, 3) +
      '-' +
      data.name.slice(3)
    ).toUpperCase();
    company.openAsk.innerHTML = data.openAsk.toFixed(4);
    company.openBid.innerHTML = data.openBid.toFixed(4);
    return company;
  }

  firstDiv(elm, compareDiv) {
    return elm.getElementsByTagName('div')[0];
  }
}
module.exports = Ticker;
