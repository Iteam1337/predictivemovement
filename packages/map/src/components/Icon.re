[@react.component]
let make = (~className=?, ~name) => {
  switch (name) {
  | `Calendar =>
    <svg
      className={Cn.make(["fill-current", className->Cn.unpack])}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20">
      <path
        d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
      />
    </svg>
  | `LocationCurrent =>
    <svg
      className={Cn.make(["fill-current", className->Cn.unpack])}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20">
      <path d="M0 0l20 8-8 4-2 8z" />
    </svg>
  | `Location =>
    <svg
      className={Cn.make(["fill-current", className->Cn.unpack])}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20">
      <path
        d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
      />
    </svg>
  };
};
