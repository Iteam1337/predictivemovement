[@react.component]
let make = (~className=?, ~name) => {
  let className = {
    Cn.make(["fill-current", className->Cn.unpack]);
  };

  switch (name) {
  | `Calendar =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
      />
    </svg>
  | `LocationCurrent =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M0 0l20 8-8 4-2 8z" />
    </svg>
  | `Location =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
      />
    </svg>
  | `Search =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
      />
    </svg>
  | `Information =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
      />
    </svg>
  | `Preview =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M.2 10a11 11 0 0 1 19.6 0A11 11 0 0 1 .2 10zm9.8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
      />
    </svg>
  };
};
