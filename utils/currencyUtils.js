const ExchangeRate = require('../models/ExchangeRate');

async function getRate(base, target) {
  if (base === target) return 1;
  const doc = await ExchangeRate.findOne({ base: base.toUpperCase(), target: target.toUpperCase() });
  if (!doc) throw new Error(`Exchange rate not found: ${base} -> ${target}`);
  return doc.rate;
}

async function convert(amount, base, target) {
  const rate = await getRate(base, target);
  return amount * rate;
}

module.exports = { getRate, convert };