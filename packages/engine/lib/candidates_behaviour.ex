defmodule CandidatesBehavior do
  @callback find_optimal_routes(list(), list()) :: map()
end
