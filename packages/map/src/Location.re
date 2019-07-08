type t = [ | `Boden];

let make =
  fun
  | `Boden => (21.690600, 65.825610)
  | `Stockholm => (18.06851, 59.329323)
  | `Umea => (20.256670, 63.828869)
  | `Storuman => (17.116289, 65.095993)
  | `Tarnaby => (15.257980, 65.710350);

let toName =
  fun
  | `Boden => "Boden"
  | `Tarnaby => {j|Tärnaby|j}
  | `Stockholm => "Stockholm"
  | `Umea => {j|Umeå|j}
  | `Storuman => "Storuman";
