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
  | `Dashboard =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.6-4.29a9.95 9.95 0 0 1 11.2 0 8 8 0 1 0-11.2 0zm6.12-7.64l3.02-3.02 1.41 1.41-3.02 3.02a2 2 0 1 1-1.41-1.41z"
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
  | `Shuffle =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M6.59 12.83L4.4 15c-.58.58-1.59 1-2.4 1H0v-2h2c.29 0 .8-.2 1-.41l2.17-2.18 1.42 1.42zM16 4V1l4 4-4 4V6h-2c-.29 0-.8.2-1 .41l-2.17 2.18L9.4 7.17 11.6 5c.58-.58 1.59-1 2.41-1h2zm0 10v-3l4 4-4 4v-3h-2c-.82 0-1.83-.42-2.41-1l-8.6-8.59C2.8 6.21 2.3 6 2 6H0V4h2c.82 0 1.83.42 2.41 1l8.6 8.59c.2.2.7.41.99.41h2z"
      />
    </svg>
  | `Time =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z"
      />
    </svg>
  | `Travel =>
    <svg className xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M11 7l1.44 2.16c.31.47 1.01.84 1.57.84H17V8h-3l-1.44-2.16a5.94 5.94 0 0 0-1.4-1.4l-1.32-.88a1.72 1.72 0 0 0-1.7-.04L4 6v5h2V7l2-1-3 14h2l2.35-7.65L11 14v6h2v-8l-2.7-2.7L11 7zm1-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
      />
    </svg>
  };
};
