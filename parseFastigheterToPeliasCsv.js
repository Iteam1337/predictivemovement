const readXlsx = require("./packages/booking-dispatcher/lib/helpers/readXlsx");
const grid_to_geodetic = require("./packages/booking-dispatcher/lib/helpers/swerefConverter");
// const { id } = require("date-fns/locale");

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "paketdata2019A.csv",
  header: [
    { id: "id", title: "id" },
    { id: "source", title: "source" },
    { id: "housenumber", title: "housenumber" },
    { id: "street", title: "street" },
    { id: "postcode", title: "postcode" },
    { id: "lat", title: "lat" },
    { id: "lon", title: "lon" },
  ],
});

const jsonPackages = readXlsx(
  `${process.cwd()}/fastigheter2019.xlsx`,
  "Fastigheter 2019"
)
  .map((row) => {
    const [lat, lon] = grid_to_geodetic(
      row["Y_SWEREF99_Fastighet"],
      row["X_SWEREF99_Fastighet"]
    );
    return {
      lat,
      lon,
      ...row,
    };
  })
  .map((row) => ({
    id: row["ID"],
    source: "fastighetsregister-2019",
    layer: "address",
    housenumber: getHouseNr(row["UTDELNINGSADRESS"]),
    street: getStreet(row["UTDELNINGSADRESS"]),
    postcode: row["POSTNR"],
    lat: row["lat"],
    lon: row["lon"],
  }));
//   .find((e) => e);
console.log(jsonPackages);
function getHouseNr(address) {
  const re = /\d+-*\s?.?/g;
  const nrMatch = address.match(re);
  if (nrMatch) {
    return nrMatch.join("");
  }
  return null;
}
function getStreet(address) {
  const re = /\d+-*\s?.?/g;
  return address.replace(re, "").trim();
}

csvWriter
  .writeRecords(jsonPackages)
  .then(() => console.log("The CSV file was written successfully"));
// {
//   id: row.id,
//   source = "iteam",
//   street: row.UTDELNINGSADRESS
//   postcode: row.POSTNR
//   lat
//   lon

// }

// id,source,layer,name,housenumber,street,postcode,lat,lon,addendum_json_pelias
// 1,pelias,example_layer,Example Location,,,,5,5
// 2,pelias,address,123 Main St,123,Main St,90210,57.698746,11.958071
// 3,pelias,invalid,123 Main St,,,,,
// 4,pelias,with_custom_data,501 Broadway,,,,10,11,"{ ""your_custom_data"":""goes here"", ""year"": 2019, ""nested"": { ""supported"": true } }"
