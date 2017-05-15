const lru = require('lru-cache')({max: 256, maxAge: 250/*ms*/});

const fs = require('fs');
const origLstat = fs.lstatSync.bind(fs);

// NB: The biggest offender of thrashing lstatSync is the node module system
// itself, which we can't get into via any sane means.
require('fs').lstatSync = function(p) {
  let r = lru.get(p);
  if (r) return r;

  r = origLstat(p);
  lru.set(p, r);
  return r;
};