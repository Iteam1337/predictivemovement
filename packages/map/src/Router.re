let handleLinkClick = e => {
  ReactEvent.Mouse.preventDefault(e);
  let anchor = ReactEvent.Mouse.currentTarget(e);
  ReasonReactRouter.push(anchor##href);
};

module Link = {
  [@react.component]
  let make = (~className="", ~href, ~children) => {
    <a className href onClick=handleLinkClick> children </a>;
  };
};

module NavLink = {
  let isActiveLink = (path, href) => {
    switch (path, href) {
    | ([], "/") => true
    | (p, _) =>
      p
      |> List.exists(pathPart =>
           href |> Js.String.split("/") |> Js.Array.includes(pathPart)
         )
    };
  };

  [@react.component]
  let make = (~className, ~activeClassName, ~href, ~children) => {
    let url = ReasonReactRouter.useUrl();
    let isActive = isActiveLink(url.path, href);
    let className =
      Cn.make([className, activeClassName->Cn.ifTrue(isActive)]);

    <a ariaSelected=isActive className href onClick=handleLinkClick>
      children
    </a>;
  };
};
