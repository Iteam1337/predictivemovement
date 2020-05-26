ExUnit.start()

Mox.defmock(CandidatesMock, for: Candidates)
Mox.defmock(VehicleMock, for: Vehicle)
Application.put_env(:engine, :candidates, CandidatesMock)
Application.put_env(:engine, :vehicle, VehicleMock)
