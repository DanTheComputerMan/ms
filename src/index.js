'use strict';

const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *  - `decimal` decimal place [0], maximum 3 decimal place
 * @param {string|number} val The value to be parsed
 * @param {Object} [options] The options for the parser
 * @returns {?string|number} The amount of milliseconds parsed or the long format of it
 * @api public
 */
module.exports = function ms(val, options) {
  options = options || {};
  let decimal = options.decimal ? Math.min(options.decimal, 3) : 0;
  let type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val, decimal) : fmtShort(val, decimal);
  }
  throw new Error(`val is not a non-empty string or a valid number. val=${JSON.stringify(val)}`);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {string} str The string to be parsed
 * @returns {?number} The amount of milliseconds parsed
 * @api private
 */
function parse(str) {
  str = String(str);
  if (str.length > 100) return;

  // eslint-disable-next-line max-len
  let match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i
    .exec(str);
  if (!match) return;

  let n = parseFloat(match[1]);
  let type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

function fmtShort(ms, decimal) {
  let msAbs = Math.abs(ms);
  let base = Math.pow(10, decimal);
  if (msAbs >= d) return `${Math.round((ms / d) * base) / base}d`;
  if (msAbs >= h) return `${Math.round((ms / h) * base) / base}h`;
  if (msAbs >= m) return `${Math.round((ms / m) * base) / base}m`;
  if (msAbs >= s) return `${Math.round((ms / s) * base) / base}s`;

  return `${ms}ms`;
}

function fmtLong(ms, demical) {
  let msAbs = Math.abs(ms);
  if (msAbs >= d) return plural(ms, msAbs, d, 'day', demical);
  if (msAbs >= h) return plural(ms, msAbs, h, 'hour', demical);
  if (msAbs >= m) return plural(ms, msAbs, m, 'minute', demical);
  if (msAbs >= s) return plural(ms, msAbs, s, 'second', demical);

  return `${ms} ms`;
}

function plural(ms, msAbs, n, name, demical) {
  let isPlural = msAbs >= n * 1.5;
  let base = Math.pow(10, demical);
  return `${Math.round((ms / n) * base) / base} ${name}${isPlural ? 's' : ''}`;
}
