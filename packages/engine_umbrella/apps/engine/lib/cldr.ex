defmodule Engine.Cldr do
  use Cldr,
  locales: ["sv"],
  providers: [Cldr.Number, Cldr.Calendar, Cldr.DateTime]
end
