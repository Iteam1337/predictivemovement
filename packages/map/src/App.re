[@react.component]
let make = () => {
  let url = ReasonReactRouter.useUrl();

  let page =
    switch (url.path) {
    | ["overview"] => <Overview />
    | _ => <Consumer />
    };

  <Notifications.Provider> <Notifications /> page </Notifications.Provider>;
};