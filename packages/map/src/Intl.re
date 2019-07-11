type intl;

/* Supported locales */
[@bs.deriving {jsConverter: newType}]
type locale = [ | [@bs.as "sv-SE"] `SWE];

module Currency = {
  /* Helper for "style" option. `decimal is the browser default */
  [@bs.deriving {jsConverter: newType}]
  type style = [ | `currency | `decimal];

  /* Helper for "currency" option */
  [@bs.deriving {jsConverter: newType}]
  type currency = [ | `SEK];

  /* Options for Intl.NumberFormat */
  [@bs.deriving abstract]
  type options = {
    [@bs.optional]
    minimumFractionDigits: int,
    [@bs.optional]
    maximumFractionDigits: int,
    [@bs.optional]
    style: abs_style,
    [@bs.optional]
    currency: abs_currency,
  };

  /*
    Intl.NumberFormat
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
   */
  [@bs.new] [@bs.scope "Intl"]
  external numberFormat: (abs_locale, options) => intl = "NumberFormat";

  /* Intl.NumberFormat.prototype.format() */
  [@bs.send] external format: (intl, float) => string = "format";

  let make =
      (
        ~value,
        ~minimumFractionDigits=2,
        ~maximumFractionDigits=2,
        ~currency=`SEK,
        ~locale=`SWE,
        ~style=`decimal,
        (),
      ) => {
    numberFormat(
      localeToJs(locale),
      options(
        ~style=styleToJs(style),
        ~currency=currencyToJs(currency),
        ~maximumFractionDigits,
        ~minimumFractionDigits,
        (),
      ),
    )
    ->format(value);
  };
};

module Date = {
  /* Helper for weekday and era options */
  [@bs.deriving {jsConverter: newType}]
  type weekdayEra = [ | `long | `short | `narrow];

  /* Helper for year and day options */
  [@bs.deriving {jsConverter: newType}]
  type yearDay = [ | `numeric | [@bs.as "2-digit"] `twoDigit];

  /* Helper for month option */
  [@bs.deriving {jsConverter: newType}]
  type month = [
    | `long
    | `short
    | `narrow
    | `numeric
    | [@bs.as "2-digit"] `twoDigit
  ];

  /* Options for Intl.DateTimeFormat */
  [@bs.deriving abstract]
  type options = {
    [@bs.optional]
    weekday: abs_weekdayEra,
    [@bs.optional]
    era: abs_weekdayEra,
    [@bs.optional]
    year: abs_yearDay,
    [@bs.optional]
    day: abs_yearDay,
    [@bs.optional]
    month: abs_month,
    [@bs.optional]
    hour: abs_yearDay,
    [@bs.optional]
    minute: abs_yearDay,
    [@bs.optional]
    hour12: bool,
  };

  /*
    Intl.DateTimeFormat
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   */
  [@bs.new] [@bs.scope "Intl"]
  external dateTimeFormat: (abs_locale, option(options)) => intl =
    "DateTimeFormat";

  /* Intl.DateTimeFormat.prototype.format() */
  [@bs.send] external format: (intl, Js.Date.t) => string = "format";

  let make = (~date=Js.Date.make(), ~locale=`SWE, ~options=None, ()) => {
    dateTimeFormat(localeToJs(locale), options)->format(date);
  };
};
