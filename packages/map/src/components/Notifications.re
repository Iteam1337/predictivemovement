open ReasonTransitionGroup;

module Notification = {
  type notificationType = [ | `Success | `Error];

  type t = {
    id: Utils.UUID.t,
    title: string,
    timeout: option(int),
    notificationType,
  };

  let make = (~title, ~notificationType, ~timeout=None, ()) => {
    id: Utils.UUID.make(),
    title,
    timeout,
    notificationType,
  };
};

module Context = {
  type t = {
    notifications: list(Notification.t),
    removeNotification: Utils.UUID.t => unit,
    updateNotifications: Notification.t => unit,
  };

  include ReactContext.Make({
    type context = t;
    let defaultValue = {
      notifications: [],
      removeNotification: _ => (),
      updateNotifications: _ => (),
    };
  });
};

module Provider = {
  type state = list(Notification.t);

  type action =
    | RemoveNotification(Utils.UUID.t)
    | UpdateNotifications(Notification.t);

  [@react.component]
  let make = (~children) => {
    let (state, dispatch) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | RemoveNotification(id) =>
            state->Belt.List.keep(n => Notification.(n.id) !== id)
          | UpdateNotifications(notification) => [notification, ...state]
          },
        [],
      );

    let updateNotifications = notification => {
      dispatch(UpdateNotifications(notification));
    };

    let removeNotification = id => {
      dispatch(RemoveNotification(id));
    };

    <Context.Provider
      value={notifications: state, updateNotifications, removeNotification}>
      children
    </Context.Provider>;
  };
};

module Style = {
  open Css;

  let enter =
    style([
      opacity(0.1),
      label("notification-enter"),
      transform(`translateY(`percent(-50.0))),
    ]);

  let enterActive =
    style([
      opacity(1.0),
      label("notification-enter-active"),
      transform(`translateY(`percent(0.0))),
      transition(~duration=300, ~timingFunction=`easeOut, "all"),
    ]);

  let exit =
    style([
      opacity(1.0),
      label("notification-exit"),
      transform(`translateY(`percent(0.0))),
    ]);

  let exitActive =
    style([
      opacity(0.01),
      label("notification-exit-active"),
      transform(`translateY(`percent(-50.0))),
      transition(~duration=300, ~timingFunction=`easeOut, "all"),
    ]);

  let classNames =
    `obj(
      CSSTransition.classFull(~enter, ~enterActive, ~exit, ~exitActive, ()),
    );
};

[@react.component]
let make = () => {
  let ctx = React.useContext(Context.t);

  <div className="absolute z-10 top-4 right-4">
    <TransitionGroup>
      {ctx.notifications
       ->Belt.List.map(({title, notificationType, id, timeout}) =>
           <CSSTransition
             timeout={`int(300)}
             unmountOnExit=true
             classNames=Style.classNames>
             {_state =>
                switch (notificationType) {
                | `Success =>
                  <Alert.Success
                    className={Some("notification mb-4")}
                    key={id->Utils.UUID.toString}
                    onRemove={Some(_ => ctx.removeNotification(id))}
                    title
                    timeout
                  />
                | `Error =>
                  <Alert.Error
                    className={Some("notification mb-4")}
                    key={id->Utils.UUID.toString}
                    onRemove={Some(_ => ctx.removeNotification(id))}
                    title
                    timeout
                  />
                }}
           </CSSTransition>
         )
       ->Belt.List.toArray
       ->React.array}
    </TransitionGroup>
  </div>;
};
