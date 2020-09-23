defmodule TimeMatrixMock do
  def get_vehicles_and_bookings do
    %{
      vehicles: [
        %{
          start_address: %{
            lon: 16.033552,
            lat: 61.840584
          },
          profile: nil,
          metadata: %{},
          latest_end: nil,
          id: "pmv-5MNjCOZb",
          end_address: %{
            lon: 16.033552,
            lat: 61.840584
          },
          earliest_start: nil,
          current_route: nil,
          capacity: %{
            weight: 50,
            volume: 18
          },
          busy: nil,
          booking_ids: nil,
          activities: nil
        },
        %{
          start_address: %{
            lon: 15.964753,
            lat: 61.765308
          },
          profile: nil,
          metadata: %{},
          latest_end: nil,
          id: "pmv-3EDtbNnn",
          end_address: %{
            lon: 15.964753,
            lat: 61.765308
          },
          earliest_start: nil,
          current_route: nil,
          capacity: %{
            weight: 700,
            volume: 15
          },
          busy: nil,
          booking_ids: nil,
          activities: nil
        }
      ],
      bookings: [
        %{
          size: %{
            weight: 100,
            measurements: [
              14,
              12,
              10
            ]
          },
          route: %{
            weight_name: "routability",
            weight: 1329.9,
            legs: [
              %{
                weight: 1329.9,
                summary: "X 728, Sjöbo Bjuråkersvägen",
                steps: [
                  %{
                    weight: 736.4,
                    ref: "X 728",
                    name: "",
                    mode: "driving",
                    maneuver: %{
                      type: "depart",
                      location: [
                        16.143637,
                        61.906519
                      ],
                      bearing_before: 0,
                      bearing_after: 182
                    },
                    intersections: [
                      %{
                        out: 0,
                        location: [
                          16.143637,
                          61.906519
                        ],
                        entry: [
                          true
                        ],
                        bearings: [
                          182
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.13898,
                          61.883331
                        ],
                        in: 2,
                        entry: [
                          true,
                          true,
                          false
                        ],
                        bearings: [
                          90,
                          165,
                          345
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.131795,
                          61.87474
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          0,
                          180,
                          285
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.126848,
                          61.865933
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          0,
                          180,
                          300
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.128164,
                          61.864015
                        ],
                        in: 2,
                        entry: [
                          true,
                          true,
                          false
                        ],
                        bearings: [
                          30,
                          180,
                          345
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.12727,
                          61.857038
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          0,
                          180,
                          300
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.125711,
                          61.853394
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          15,
                          75,
                          195
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.125271,
                          61.852204
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          15,
                          105,
                          225
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.119409,
                          61.848089
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          0,
                          180,
                          240
                        ]
                      },
                      %{
                        out: 0,
                        location: [
                          16.124018,
                          61.842939
                        ],
                        in: 2,
                        entry: [
                          true,
                          true,
                          false
                        ],
                        bearings: [
                          150,
                          270,
                          330
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.124062,
                          61.842898
                        ],
                        in: 2,
                        entry: [
                          true,
                          true,
                          false
                        ],
                        bearings: [
                          90,
                          150,
                          330
                        ]
                      }
                    ],
                    geometry:
                      "wbzxJw`paBxAFl@XvF`Gv@XhFU|BsCdHmLpAqArAe@pMmBf@?`EfBlAfAtEfJlItWxAzD\\j@hFbDnO|@|J]`Q_FpEuAxEyAjAGb@XdFbGh]nf@l@FlCW~Iw@vAX|MxK~OvN`EfBhB@n@?lIeG|LuAt\\fGnF`AhNtFlFvA|@xB`AzEjBzI|AvD~A~BxDbBlCt@bANt@JzBu@~CiCrTeVFGrAkArAk@dAHnQ~B",
                    duration: 736.4,
                    driving_side: "right",
                    distance: 8165
                  },
                  %{
                    weight: 194.2,
                    ref: "X 727",
                    name: "Sjöbo Bjuråkersvägen",
                    mode: "driving",
                    maneuver: %{
                      type: "end of road",
                      modifier: "right",
                      location: [
                        16.123967,
                        61.838745
                      ],
                      bearing_before: 185,
                      bearing_after: 267
                    },
                    intersections: [
                      %{
                        out: 2,
                        location: [
                          16.123967,
                          61.838745
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          0,
                          90,
                          270
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.122121,
                          61.838707
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          0,
                          90,
                          255
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.121822,
                          61.838687
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          75,
                          180,
                          255
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.118636,
                          61.838364
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          75,
                          255,
                          345
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.115302,
                          61.837873
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          75,
                          150,
                          255
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.105444,
                          61.836316
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          75,
                          270,
                          345
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.102048,
                          61.834874
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true,
                          true
                        ],
                        bearings: [
                          30,
                          120,
                          210,
                          300
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.100958,
                          61.834148
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          30,
                          210,
                          300
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.099916,
                          61.833477
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          30,
                          120,
                          225
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.097482,
                          61.832304
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true,
                          true
                        ],
                        bearings: [
                          45,
                          120,
                          225,
                          300
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.094624,
                          61.831118
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true,
                          true
                        ],
                        bearings: [
                          45,
                          105,
                          210,
                          315
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.093568,
                          61.830453
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          30,
                          120,
                          210
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.092663,
                          61.829747
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true,
                          true
                        ],
                        bearings: [
                          30,
                          120,
                          210,
                          330
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.091941,
                          61.829215
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          30,
                          120,
                          210
                        ]
                      }
                    ],
                    geometry:
                      "e%{lxJyelaBDxE@vCBz@PzFXbFTzCFz@HhAFx@NxBVpD^nDH|@VnD^rIXbFVrC\\hChAvGv@fH`@nHDnBZ|B`@lBvA~BdChEnCxE`AbBbAjBz@`BbApCjBrFvAzErC~I~@dBdAjBjCtDdA|Ab@p@fA~A",
                    duration: 194.2,
                    driving_side: "right",
                    distance: 2144.1
                  },
                  %{
                    weight: 51.5,
                    ref: "84",
                    name: "Norra Järnvägsgatan",
                    mode: "driving",
                    maneuver: %{
                      type: "roundabout turn",
                      modifier: "right",
                      location: [
                        16.091455,
                        61.828857
                      ],
                      exit: 1,
                      bearing_before: 212,
                      bearing_after: 288
                    },
                    intersections: [
                      %{
                        out: 2,
                        location: [
                          16.091455,
                          61.828857
                        ],
                        in: 0,
                        entry: [
                          false,
                          false,
                          true
                        ],
                        bearings: [
                          30,
                          135,
                          285
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.091169,
                          61.828827
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          45,
                          195,
                          300
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.090209,
                          61.829141
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          30,
                          120,
                          300
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.089249,
                          61.829423
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          30,
                          120,
                          300
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.08736,
                          61.829865
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          15,
                          105,
                          285
                        ]
                      }
                    ],
                    geometry:
                      "k}jxJszeaBAN?NBLBJIPs@lDOp@QbAUhA]pBm@|DMhAGl@Ex@Ex@C|@?dABfADfAHv@FdARjBLvALjAJ|@RbAd@bB",
                    duration: 51.5,
                    driving_side: "right",
                    distance: 549.7
                  },
                  %{
                    weight: 7.2,
                    ref: "84",
                    name: "Kyrkogatan",
                    mode: "driving",
                    maneuver: %{
                      type: "roundabout",
                      modifier: "right",
                      location: [
                        16.082025,
                        61.829255
                      ],
                      exit: 2,
                      bearing_before: 230,
                      bearing_after: 303
                    },
                    intersections: [
                      %{
                        out: 2,
                        location: [
                          16.082025,
                          61.829255
                        ],
                        in: 0,
                        entry: [
                          false,
                          false,
                          true
                        ],
                        bearings: [
                          45,
                          150,
                          300
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.081612,
                          61.829264
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          60,
                          210,
                          315
                        ]
                      }
                    ],
                    geometry: "%{_kxJu_daBERAT@TDRFLHBHAHKDQ",
                    duration: 7.2,
                    driving_side: "right",
                    distance: 53.9
                  },
                  %{
                    weight: 41.8,
                    ref: "84",
                    name: "Kyrkogatan",
                    mode: "driving",
                    maneuver: %{
                      type: "exit roundabout",
                      modifier: "right",
                      location: [
                        16.081683,
                        61.829037
                      ],
                      exit: 2,
                      bearing_before: 123,
                      bearing_after: 219
                    },
                    intersections: [
                      %{
                        out: 1,
                        location: [
                          16.081683,
                          61.829037
                        ],
                        in: 2,
                        entry: [
                          true,
                          true,
                          false
                        ],
                        bearings: [
                          105,
                          225,
                          300
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.078273,
                          61.827892
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          0,
                          90,
                          285
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.077486,
                          61.827941
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          105,
                          195,
                          285
                        ]
                      }
                    ],
                    geometry: "o~jxJo}caBj@hAHNb@x@bAhBb@hATpALzB?rCIzCYhHg@lIAh@",
                    duration: 41.8,
                    driving_side: "right",
                    distance: 457.9
                  },
                  %{
                    weight: 78.4,
                    ref: "83; 84",
                    name: "",
                    mode: "driving",
                    maneuver: %{
                      type: "turn",
                      modifier: "left",
                      location: [
                        16.074116,
                        61.828277
                      ],
                      bearing_before: 272,
                      bearing_after: 226
                    },
                    intersections: [
                      %{
                        out: 1,
                        location: [
                          16.074116,
                          61.828277
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          90,
                          225,
                          330
                        ]
                      },
                      %{
                        out: 1,
                        location: [
                          16.072412,
                          61.827236
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          45,
                          210,
                          255
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.069701,
                          61.825452
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          30,
                          120,
                          225
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.063312,
                          61.822336
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true,
                          true
                        ],
                        bearings: [
                          45,
                          150,
                          225,
                          330
                        ]
                      },
                      %{
                        out: 2,
                        location: [
                          16.06213,
                          61.821489
                        ],
                        in: 0,
                        entry: [
                          false,
                          false,
                          true
                        ],
                        bearings: [
                          30,
                          195,
                          240
                        ]
                      }
                    ],
                    geometry:
                      "wyjxJgnbaBL^Zj@nAzBVb@|@hBdJ|O|@xB|@xBpLr[~@tBj@hAx@tA\\b@d@f@P`@DTBL",
                    duration: 78.4,
                    driving_side: "right",
                    distance: 1011.4
                  },
                  %{
                    weight: 1.2,
                    ref: "84",
                    name: "",
                    mode: "driving",
                    maneuver: %{
                      type: "roundabout",
                      modifier: "right",
                      location: [
                        16.061775,
                        61.821347
                      ],
                      exit: 1,
                      bearing_before: 227,
                      bearing_after: 275
                    },
                    intersections: [
                      %{
                        out: 2,
                        location: [
                          16.061775,
                          61.821347
                        ],
                        in: 0,
                        entry: [
                          false,
                          false,
                          true
                        ],
                        bearings: [
                          45,
                          120,
                          270
                        ]
                      }
                    ],
                    geometry: "mnixJca`aBAV@V",
                    duration: 1.2,
                    driving_side: "right",
                    distance: 12.6
                  },
                  %{
                    weight: 73.3,
                    ref: "84",
                    name: "",
                    mode: "driving",
                    maneuver: %{
                      type: "exit roundabout",
                      modifier: "straight",
                      location: [
                        16.061538,
                        61.821346
                      ],
                      exit: 1,
                      bearing_before: 260,
                      bearing_after: 279
                    },
                    intersections: [
                      %{
                        out: 2,
                        location: [
                          16.061538,
                          61.821346
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          75,
                          240,
                          285
                        ]
                      }
                    ],
                    geometry:
                      "mnixJs_`aBItBAjAAj@?n@BlA@Z@tA@dBAx@ChAGzAGdAI|@OnAm@~D_Hx`@W|AeD|VkDhYm@rKEvKLrG",
                    duration: 73.3,
                    driving_side: "right",
                    distance: 1434.1
                  },
                  %{
                    weight: 133.6,
                    name: "",
                    mode: "driving",
                    maneuver: %{
                      type: "turn",
                      modifier: "right",
                      location: [
                        16.036135,
                        61.825281
                      ],
                      bearing_before: 262,
                      bearing_after: 345
                    },
                    intersections: [
                      %{
                        out: 2,
                        location: [
                          16.036135,
                          61.825281
                        ],
                        in: 0,
                        entry: [
                          false,
                          true,
                          true
                        ],
                        bearings: [
                          90,
                          255,
                          345
                        ]
                      },
                      %{
                        out: 0,
                        location: [
                          16.03582,
                          61.826941
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          15,
                          195,
                          270
                        ]
                      },
                      %{
                        out: 0,
                        location: [
                          16.039845,
                          61.82931
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          60,
                          225,
                          315
                        ]
                      },
                      %{
                        out: 0,
                        location: [
                          16.042554,
                          61.830193
                        ],
                        in: 2,
                        entry: [
                          true,
                          true,
                          false
                        ],
                        bearings: [
                          75,
                          150,
                          240
                        ]
                      },
                      %{
                        out: 0,
                        location: [
                          16.043325,
                          61.830337
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          75,
                          255,
                          330
                        ]
                      },
                      %{
                        out: 0,
                        location: [
                          16.044561,
                          61.830579
                        ],
                        in: 2,
                        entry: [
                          true,
                          true,
                          false
                        ],
                        bearings: [
                          60,
                          120,
                          240
                        ]
                      }
                    ],
                    geometry:
                      "_gjxJ%{`%{`BeE~A]@a@C_@Ke@Q]UQOIGk@o@u@iAs@mAyAcCu@oByB%{HkBoHcAkF]%{C_@iDOkAWgAWq@_@}@",
                    duration: 133.6,
                    driving_side: "right",
                    distance: 884
                  },
                  %{
                    weight: 12.3,
                    name: "",
                    mode: "driving",
                    maneuver: %{
                      type: "turn",
                      modifier: "left",
                      location: [
                        16.045476,
                        61.83098
                      ],
                      bearing_before: 40,
                      bearing_after: 302
                    },
                    intersections: [
                      %{
                        out: 2,
                        location: [
                          16.045476,
                          61.83098
                        ],
                        in: 1,
                        entry: [
                          true,
                          false,
                          true
                        ],
                        bearings: [
                          45,
                          225,
                          300
                        ]
                      }
                    ],
                    geometry: "sjkxJg%{|`B]`BIr@?T",
                    duration: 12.3,
                    driving_side: "right",
                    distance: 51
                  },
                  %{
                    weight: 0,
                    name: "",
                    mode: "driving",
                    maneuver: %{
                      type: "arrive",
                      location: [
                        16.044623,
                        61.831175
                      ],
                      bearing_before: 262,
                      bearing_after: 0
                    },
                    intersections: [
                      %{
                        location: [
                          16.044623,
                          61.831175
                        ],
                        in: 0,
                        entry: [
                          true
                        ],
                        bearings: [
                          82
                        ]
                      }
                    ],
                    geometry: "%{kkxJ%{u|`B",
                    duration: 0,
                    driving_side: "right",
                    distance: 0
                  }
                ],
                duration: 1329.9,
                distance: 14763.5,
                annotation: %{
                  weight: [
                    4.5,
                    2.4,
                    13.8,
                    2.8,
                    11.8,
                    7.3,
                    17.9,
                    4.5,
                    4.4,
                    23.4,
                    2,
                    10,
                    4.3,
                    13.7,
                    25,
                    6.3,
                    1.9,
                    12.3,
                    26.5,
                    19.1,
                    29.4,
                    10.7,
                    11.2,
                    3.8,
                    1.9,
                    13.1,
                    56.9,
                    2.4,
                    7.1,
                    17.7,
                    4.4,
                    25.8,
                    29.7,
                    10,
                    5.3,
                    2.4,
                    17.9,
                    22.4,
                    48,
                    12.1,
                    25.2,
                    12.1,
                    4.3,
                    6.1,
                    9.8,
                    6.4,
                    5.6,
                    9.6,
                    7.3,
                    3.4,
                    2.7,
                    6.4,
                    8.6,
                    38.8,
                    0.5,
                    4.6,
                    4.3,
                    3.5,
                    29.8,
                    5.1,
                    3.6,
                    1.4,
                    6,
                    5.5,
                    3.8,
                    1.4,
                    1.8,
                    1.5,
                    3,
                    4.4,
                    4.4,
                    1.6,
                    4.3,
                    8.2,
                    5.6,
                    3.7,
                    3.6,
                    7.6,
                    7.6,
                    7.4,
                    2.7,
                    3.3,
                    3.1,
                    5.4,
                    8.2,
                    8.9,
                    4.1,
                    4.3,
                    3.7,
                    4.9,
                    7.8,
                    6.8,
                    11.2,
                    4,
                    4.3,
                    8.3,
                    4.2,
                    2.2,
                    4.3,
                    0.4,
                    0.4,
                    0.4,
                    0.4,
                    0.7,
                    4.9,
                    1.4,
                    1.9,
                    2.1,
                    3.1,
                    5,
                    1.9,
                    1.2,
                    1.4,
                    1.4,
                    1.5,
                    1.6,
                    1.7,
                    1.8,
                    1.4,
                    1.7,
                    2.7,
                    2.2,
                    1.9,
                    1.6,
                    1.9,
                    3.1,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    2.8,
                    0.6,
                    2.3,
                    4.2,
                    2.5,
                    2.3,
                    3,
                    3.5,
                    3.8,
                    7.1,
                    8.2,
                    1,
                    1,
                    1.8,
                    4.9,
                    1.5,
                    3.3,
                    18.3,
                    3.5,
                    3.6,
                    25.5,
                    3.6,
                    2.3,
                    3,
                    1.4,
                    1.8,
                    1.6,
                    0.7,
                    0.5,
                    0.6,
                    0.6,
                    1.6,
                    1,
                    0.6,
                    0.6,
                    1,
                    0.4,
                    1.1,
                    1.3,
                    0.8,
                    1,
                    1.2,
                    0.9,
                    0.9,
                    1.1,
                    2.8,
                    16.3,
                    1.4,
                    11.1,
                    12.1,
                    5.5,
                    5.4,
                    3.7,
                    16.3,
                    2.4,
                    2.6,
                    2.6,
                    3.2,
                    2.5,
                    1.6,
                    0.8,
                    3.9,
                    5.3,
                    5.1,
                    8.7,
                    6.2,
                    15.4,
                    14.4,
                    10.5,
                    6.3,
                    6.9,
                    3.2,
                    3.3,
                    2.7,
                    3.5,
                    7.3,
                    3.6,
                    1.4
                  ],
                  speed: [
                    11.1,
                    11.2,
                    11.1,
                    11.1,
                    11.1,
                    11,
                    11.1,
                    11,
                    11,
                    11.1,
                    11.2,
                    11.1,
                    11,
                    11.1,
                    11.1,
                    11.1,
                    10.8,
                    11.1,
                    11.1,
                    11.1,
                    11.1,
                    11.1,
                    11.1,
                    11.1,
                    11,
                    11.1,
                    11.1,
                    11,
                    11.1,
                    11.1,
                    11.2,
                    11.1,
                    11.1,
                    11.1,
                    11.1,
                    11.2,
                    11.1,
                    11.1,
                    11.1,
                    11.1,
                    11.1,
                    11.1,
                    11.2,
                    11.1,
                    11.1,
                    11.2,
                    11.2,
                    11.1,
                    11,
                    11.1,
                    11,
                    11.1,
                    11.2,
                    11.1,
                    10.2,
                    11,
                    11.2,
                    11,
                    11.1,
                    11.2,
                    11.1,
                    11.3,
                    11.2,
                    11.2,
                    11.2,
                    11.5,
                    11.2,
                    10.7,
                    11.1,
                    11.1,
                    11.1,
                    11,
                    11.2,
                    11.1,
                    11.1,
                    11,
                    11.1,
                    11.1,
                    11,
                    11.1,
                    11,
                    11.1,
                    11.1,
                    11,
                    11.1,
                    11.1,
                    11,
                    11,
                    11.2,
                    11.1,
                    11.2,
                    11.2,
                    11.1,
                    11.2,
                    11.1,
                    11.1,
                    11,
                    10.9,
                    11,
                    10.6,
                    10.6,
                    10.7,
                    10.5,
                    10.4,
                    11.1,
                    11.1,
                    11,
                    10.9,
                    11,
                    11.2,
                    10.9,
                    10.9,
                    11,
                    11,
                    11.1,
                    11.4,
                    11.1,
                    10.9,
                    10.9,
                    11.2,
                    11.3,
                    11.3,
                    11.1,
                    11.2,
                    11,
                    11,
                    11.9,
                    12,
                    12,
                    12,
                    11.9,
                    11.9,
                    12.1,
                    11.9,
                    12,
                    11.1,
                    11.6,
                    11.2,
                    11.1,
                    11,
                    10.9,
                    11.1,
                    11.1,
                    11,
                    11.2,
                    11.1,
                    11.3,
                    10.8,
                    11,
                    11.2,
                    11.1,
                    13.5,
                    13.3,
                    13.4,
                    13.2,
                    13.3,
                    13.2,
                    13.3,
                    13.3,
                    13.5,
                    13.2,
                    8.7,
                    9.2,
                    9,
                    10.5,
                    10.5,
                    19.8,
                    19.8,
                    19.4,
                    20.7,
                    20.5,
                    19.7,
                    20.4,
                    20.7,
                    19.3,
                    19.1,
                    20.6,
                    21,
                    19.5,
                    20.6,
                    20.2,
                    20,
                    19.8,
                    19.9,
                    20,
                    19.8,
                    19.8,
                    19.8,
                    6.9,
                    7.1,
                    7.1,
                    6.9,
                    6.9,
                    6.9,
                    7.1,
                    7.3,
                    6.9,
                    6.9,
                    6.9,
                    6.9,
                    6.9,
                    6.9,
                    6.9,
                    7,
                    6.9,
                    7,
                    6.9,
                    6.9,
                    6.9,
                    7,
                    4.2,
                    4.2,
                    3.9
                  ],
                  nodes: [
                    431_555_280,
                    431_555_278,
                    431_555_275,
                    431_555_274,
                    431_555_272,
                    431_555_264,
                    431_555_261,
                    431_555_258,
                    431_555_257,
                    431_555_255,
                    431_555_254,
                    431_555_253,
                    431_555_250,
                    431_555_246,
                    431_555_244,
                    431_555_241,
                    431_555_239,
                    431_555_236,
                    431_555_233,
                    431_555_232,
                    431_555_231,
                    431_555_227,
                    5_791_781_157,
                    431_555_224,
                    431_555_221,
                    431_555_216,
                    431_555_215,
                    431_555_214,
                    431_555_213,
                    4_228_691_734,
                    431_555_211,
                    431_555_208,
                    431_555_205,
                    431_555_200,
                    431_555_196,
                    2_324_420_360,
                    431_555_194,
                    431_555_183,
                    431_555_180,
                    2_324_420_329,
                    431_555_178,
                    378_194_425,
                    378_194_389,
                    378_194_379,
                    378_194_363,
                    378_194_349,
                    378_194_322,
                    378_194_307,
                    378_194_295,
                    378_194_286,
                    2_324_420_318,
                    378_194_271,
                    378_194_261,
                    378_194_247,
                    2_324_420_212,
                    2_324_420_208,
                    378_194_237,
                    378_194_225,
                    378_194_210,
                    378_194_040,
                    886_673_844,
                    2_324_420_089,
                    2_324_420_088,
                    378_194_068,
                    378_194_082,
                    2_324_420_083,
                    2_324_420_077,
                    886_672_252,
                    2_324_420_069,
                    2_324_420_068,
                    378_194_098,
                    2_324_420_056,
                    886_672_250,
                    378_194_113,
                    378_194_123,
                    886_672_245,
                    886_672_243,
                    886_672_242,
                    886_672_238,
                    378_194_140,
                    378_194_177,
                    886_670_880,
                    886_670_879,
                    886_670_877,
                    378_194_187,
                    886_670_469,
                    3_997_128_159,
                    886_670_419,
                    2_902_631_623,
                    886_670_416,
                    378_194_201,
                    378_189_804,
                    5_018_708_199,
                    378_189_655,
                    378_189_775,
                    378_189_771,
                    27_557_495,
                    5_018_708_141,
                    5_440_541_124,
                    886_739_084,
                    2_901_776_209,
                    2_901_776_208,
                    2_901_776_207,
                    886_739_059,
                    2_902_379_680,
                    27_557_493,
                    4_773_774_078,
                    4_773_774_079,
                    27_557_492,
                    2_902_379_684,
                    2_902_379_687,
                    11_522_428,
                    2_902_379_689,
                    11_522_679,
                    2_902_379_691,
                    11_521_991,
                    2_902_379_692,
                    11_522_239,
                    2_902_379_690,
                    11_522_452,
                    2_902_379_688,
                    378_132_942,
                    2_902_379_686,
                    2_902_379_685,
                    11_522_694,
                    2_902_379_683,
                    11_521_982,
                    2_901_776_220,
                    2_901_776_221,
                    2_901_776_219,
                    11_522_760,
                    2_901_776_218,
                    2_901_776_216,
                    2_901_776_213,
                    2_901_776_212,
                    378_132_358,
                    11_522_335,
                    5_018_708_011,
                    5_018_708_196,
                    11_522_202,
                    11_522_779,
                    11_522_050,
                    11_522_310,
                    378_132_421,
                    11_522_269,
                    2_434_814_375,
                    11_522_480,
                    11_522_722,
                    11_521_985,
                    5_018_708_185,
                    5_018_708_194,
                    1_419_609_552,
                    11_522_164,
                    378_137_701,
                    11_522_438,
                    378_136_000,
                    378_135_993,
                    378_137_384,
                    11_521_974,
                    11_522_153,
                    2_955_100_806,
                    11_522_583,
                    2_955_100_805,
                    2_955_100_801,
                    2_955_100_800,
                    850_514_030,
                    378_136_447,
                    2_955_100_803,
                    2_955_100_804,
                    5_022_701_291,
                    5_022_701_292,
                    2_955_100_802,
                    253_186_179,
                    5_022_701_293,
                    5_022_701_294,
                    5_022_701_295,
                    253_186_178,
                    5_022_701_296,
                    5_022_701_297,
                    253_186_177,
                    5_022_701_298,
                    253_186_176,
                    5_022_701_490,
                    253_186_175,
                    253_186_174,
                    850_513_354,
                    253_186_173,
                    253_186_172,
                    378_137_575,
                    1_885_446_344,
                    2_435_553_721,
                    2_435_553_754,
                    5_022_701_471,
                    1_885_446_346,
                    5_022_701_473,
                    5_022_701_496,
                    2_435_553_702,
                    5_022_701_472,
                    1_885_446_347,
                    5_022_701_469,
                    378_137_502,
                    2_435_553_701,
                    1_885_446_348,
                    378_137_499,
                    378_137_497,
                    5_800_585_699,
                    378_137_493,
                    2_435_553_734,
                    378_137_490,
                    2_435_553_743,
                    5_800_585_705,
                    5_800_585_700,
                    5_800_585_703,
                    5_800_585_704
                  ],
                  metadata: %{
                    datasource_names: [
                      "lua profile"
                    ]
                  },
                  duration: [
                    4.5,
                    2.4,
                    13.8,
                    2.8,
                    11.8,
                    7.3,
                    17.9,
                    4.5,
                    4.4,
                    23.4,
                    2,
                    10,
                    4.3,
                    13.7,
                    25,
                    6.3,
                    1.9,
                    12.3,
                    26.5,
                    19.1,
                    29.4,
                    10.7,
                    11.2,
                    3.8,
                    1.9,
                    13.1,
                    56.9,
                    2.4,
                    7.1,
                    17.7,
                    4.4,
                    25.8,
                    29.7,
                    10,
                    5.3,
                    2.4,
                    17.9,
                    22.4,
                    48,
                    12.1,
                    25.2,
                    12.1,
                    4.3,
                    6.1,
                    9.8,
                    6.4,
                    5.6,
                    9.6,
                    7.3,
                    3.4,
                    2.7,
                    6.4,
                    8.6,
                    38.8,
                    0.5,
                    4.6,
                    4.3,
                    3.5,
                    29.8,
                    5.1,
                    3.6,
                    1.4,
                    6,
                    5.5,
                    3.8,
                    1.4,
                    1.8,
                    1.5,
                    3,
                    4.4,
                    4.4,
                    1.6,
                    4.3,
                    8.2,
                    5.6,
                    3.7,
                    3.6,
                    7.6,
                    7.6,
                    7.4,
                    2.7,
                    3.3,
                    3.1,
                    5.4,
                    8.2,
                    8.9,
                    4.1,
                    4.3,
                    3.7,
                    4.9,
                    7.8,
                    6.8,
                    11.2,
                    4,
                    4.3,
                    8.3,
                    4.2,
                    2.2,
                    4.3,
                    0.4,
                    0.4,
                    0.4,
                    0.4,
                    0.7,
                    4.9,
                    1.4,
                    1.9,
                    2.1,
                    3.1,
                    5,
                    1.9,
                    1.2,
                    1.4,
                    1.4,
                    1.5,
                    1.6,
                    1.7,
                    1.8,
                    1.4,
                    1.7,
                    2.7,
                    2.2,
                    1.9,
                    1.6,
                    1.9,
                    3.1,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    0.5,
                    2.8,
                    0.6,
                    2.3,
                    4.2,
                    2.5,
                    2.3,
                    3,
                    3.5,
                    3.8,
                    7.1,
                    8.2,
                    1,
                    1,
                    1.8,
                    4.9,
                    1.5,
                    3.3,
                    18.3,
                    3.5,
                    3.6,
                    25.5,
                    3.6,
                    2.3,
                    3,
                    1.4,
                    1.8,
                    1.6,
                    0.7,
                    0.5,
                    0.6,
                    0.6,
                    1.6,
                    1,
                    0.6,
                    0.6,
                    1,
                    0.4,
                    1.1,
                    1.3,
                    0.8,
                    1,
                    1.2,
                    0.9,
                    0.9,
                    1.1,
                    2.8,
                    16.3,
                    1.4,
                    11.1,
                    12.1,
                    5.5,
                    5.4,
                    3.7,
                    16.3,
                    2.4,
                    2.6,
                    2.6,
                    3.2,
                    2.5,
                    1.6,
                    0.8,
                    3.9,
                    5.3,
                    5.1,
                    8.7,
                    6.2,
                    15.4,
                    14.4,
                    10.5,
                    6.3,
                    6.9,
                    3.2,
                    3.3,
                    2.7,
                    3.5,
                    7.3,
                    3.6,
                    1.4
                  ],
                  distance: [
                    49.755913,
                    26.958501,
                    153.798498,
                    31.033618,
                    130.602656,
                    80.570878,
                    198.457445,
                    49.687387,
                    48.59189,
                    260.067873,
                    22.47266,
                    111.06066,
                    47.267243,
                    151.928282,
                    278.282082,
                    70.181251,
                    20.581586,
                    136.207509,
                    294.647567,
                    212.252252,
                    327.160382,
                    118.655073,
                    123.976833,
                    42.083553,
                    20.887612,
                    145.349227,
                    632.53586,
                    26.417355,
                    78.859874,
                    196.652606,
                    49.067101,
                    286.350772,
                    330.485182,
                    111.239713,
                    58.729383,
                    26.806359,
                    198.814973,
                    248.716218,
                    532.857063,
                    134.272402,
                    279.680635,
                    134.35765,
                    47.996206,
                    68.000621,
                    109.242431,
                    71.389885,
                    62.734605,
                    106.66021,
                    80.597295,
                    37.811023,
                    29.758871,
                    71.216471,
                    95.904729,
                    431.051916,
                    5.111704,
                    50.815104,
                    48.229037,
                    38.559966,
                    331.519348,
                    56.95119,
                    40.044961,
                    15.852519,
                    67.162856,
                    61.465073,
                    42.740943,
                    16.093014,
                    20.234374,
                    16.112341,
                    33.155431,
                    48.802419,
                    49.033537,
                    17.631314,
                    47.993974,
                    90.786288,
                    61.901464,
                    40.795677,
                    39.831041,
                    84.241805,
                    83.893014,
                    81.803941,
                    29.760754,
                    36.793665,
                    34.25721,
                    59.60906,
                    90.977806,
                    98.971905,
                    45.125152,
                    47.422297,
                    41.390259,
                    54.514402,
                    87.089488,
                    75.862412,
                    123.961556,
                    44.610974,
                    47.832824,
                    91.784916,
                    46.356022,
                    23.919786,
                    47.295105,
                    4.234972,
                    4.254819,
                    4.273923,
                    4.203071,
                    7.248261,
                    54.323236,
                    15.538945,
                    20.886742,
                    22.94555,
                    34.144359,
                    56.014288,
                    20.670755,
                    13.136191,
                    15.440738,
                    15.448141,
                    16.674723,
                    18.273386,
                    18.904454,
                    19.660013,
                    15.29647,
                    18.975893,
                    30.397057,
                    24.761577,
                    21.05399,
                    17.843535,
                    20.827582,
                    34.228203,
                    5.958305,
                    6.005279,
                    5.999971,
                    6.014996,
                    5.968609,
                    5.967722,
                    6.072195,
                    5.954268,
                    6.000526,
                    30.958947,
                    6.938087,
                    25.84026,
                    46.712731,
                    27.465151,
                    25.145017,
                    33.169283,
                    38.86312,
                    41.685005,
                    79.226893,
                    90.624986,
                    11.251255,
                    10.808267,
                    19.809891,
                    54.858282,
                    16.658538,
                    44.430952,
                    244.217632,
                    46.958153,
                    47.674142,
                    340.241451,
                    47.697071,
                    30.608527,
                    39.895116,
                    18.939607,
                    23.746204,
                    13.852005,
                    6.464904,
                    4.489651,
                    6.329956,
                    6.296791,
                    31.619681,
                    19.786847,
                    11.633761,
                    12.403511,
                    20.508977,
                    7.86463,
                    22.393307,
                    26.847806,
                    15.461526,
                    19.066382,
                    24.711398,
                    18.893504,
                    17.584965,
                    22.666577,
                    56.446752,
                    326.511747,
                    27.678923,
                    221.180337,
                    241.471154,
                    109.050836,
                    107.133562,
                    73.135301,
                    112.9042,
                    16.920176,
                    18.392043,
                    18.063909,
                    21.992157,
                    17.254996,
                    11.371018,
                    5.859922,
                    26.835526,
                    36.518742,
                    35.405861,
                    60.241316,
                    42.779916,
                    106.732439,
                    99.888954,
                    73.166457,
                    43.537069,
                    48.252072,
                    22.032817,
                    22.818692,
                    18.715565,
                    24.329705,
                    30.549386,
                    14.977543,
                    5.463949
                  ],
                  datasources: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                  ]
                }
              }
            ],
            geometry: %{
              coordinates: [
                %{
                  lon: 16.14364,
                  lat: 61.90652
                },
                %{
                  lon: 16.143600000000003,
                  lat: 61.90607
                },
                %{
                  lon: 16.143470000000004,
                  lat: 61.90584
                },
                %{
                  lon: 16.142180000000003,
                  lat: 61.904599999999995
                },
                %{
                  lon: 16.142050000000005,
                  lat: 61.90432
                },
                %{
                  lon: 16.142160000000004,
                  lat: 61.90315
                },
                %{
                  lon: 16.142900000000004,
                  lat: 61.902519999999996
                },
                %{
                  lon: 16.145050000000005,
                  lat: 61.90105
                },
                %{
                  lon: 16.145460000000003,
                  lat: 61.900639999999996
                },
                %{
                  lon: 16.145650000000003,
                  lat: 61.90022
                },
                %{
                  lon: 16.146200000000004,
                  lat: 61.89789
                },
                %{
                  lon: 16.146200000000004,
                  lat: 61.89769
                },
                %{
                  lon: 16.145680000000002,
                  lat: 61.896719999999995
                },
                %{
                  lon: 16.14532,
                  lat: 61.89632999999999
                },
                %{
                  lon: 16.143520000000002,
                  lat: 61.89525999999999
                },
                %{
                  lon: 16.139570000000003,
                  lat: 61.893589999999996
                },
                %{
                  lon: 16.138630000000003,
                  lat: 61.893139999999995
                },
                %{
                  lon: 16.138410000000004,
                  lat: 61.89299
                },
                %{
                  lon: 16.137590000000003,
                  lat: 61.891819999999996
                },
                %{
                  lon: 16.137280000000004,
                  lat: 61.889179999999996
                },
                %{
                  lon: 16.137430000000005,
                  lat: 61.887269999999994
                },
                %{
                  lon: 16.138550000000006,
                  lat: 61.88437999999999
                },
                %{
                  lon: 16.138980000000007,
                  lat: 61.883329999999994
                },
                %{
                  lon: 16.139430000000008,
                  lat: 61.882239999999996
                },
                %{
                  lon: 16.139470000000006,
                  lat: 61.881859999999996
                },
                %{
                  lon: 16.139340000000008,
                  lat: 61.881679999999996
                },
                %{
                  lon: 16.138040000000007,
                  lat: 61.88052999999999
                },
                %{
                  lon: 16.13172000000001,
                  lat: 61.875679999999996
                },
                %{
                  lon: 16.13168000000001,
                  lat: 61.875449999999994
                },
                %{
                  lon: 16.13180000000001,
                  lat: 61.874739999999996
                },
                %{
                  lon: 16.13208000000001,
                  lat: 61.87298
                },
                %{
                  lon: 16.13195000000001,
                  lat: 61.87254
                },
                %{
                  lon: 16.12990000000001,
                  lat: 61.87015
                },
                %{
                  lon: 16.12738000000001,
                  lat: 61.867430000000006
                },
                %{
                  lon: 16.126860000000008,
                  lat: 61.866460000000004
                },
                %{
                  lon: 16.126850000000008,
                  lat: 61.865930000000006
                },
                %{
                  lon: 16.126850000000008,
                  lat: 61.86569000000001
                },
                %{
                  lon: 16.12816000000001,
                  lat: 61.86402000000001
                },
                %{
                  lon: 16.12859000000001,
                  lat: 61.86179000000001
                },
                %{
                  lon: 16.12727000000001,
                  lat: 61.85704000000001
                },
                %{
                  lon: 16.12694000000001,
                  lat: 61.855840000000015
                },
                %{
                  lon: 16.12571000000001,
                  lat: 61.85339000000001
                },
                %{
                  lon: 16.125270000000008,
                  lat: 61.85220000000001
                },
                %{
                  lon: 16.124660000000006,
                  lat: 61.85189000000001
                },
                %{
                  lon: 16.123560000000005,
                  lat: 61.85156000000001
                },
                %{
                  lon: 16.121820000000003,
                  lat: 61.85102000000001
                },
                %{
                  lon: 16.120900000000002,
                  lat: 61.85055000000001
                },
                %{
                  lon: 16.120260000000002,
                  lat: 61.85007000000001
                },
                %{
                  lon: 16.119760000000003,
                  lat: 61.84914000000001
                },
                %{
                  lon: 16.119490000000003,
                  lat: 61.848430000000015
                },
                %{
                  lon: 16.119410000000002,
                  lat: 61.84809000000001
                },
                %{
                  lon: 16.11935,
                  lat: 61.84782000000001
                },
                %{
                  lon: 16.11962,
                  lat: 61.847200000000015
                },
                %{
                  lon: 16.12031,
                  lat: 61.84640000000002
                },
                %{
                  lon: 16.12402,
                  lat: 61.84294000000002
                },
                %{
                  lon: 16.12406,
                  lat: 61.84290000000002
                },
                %{
                  lon: 16.12444,
                  lat: 61.84248000000002
                },
                %{
                  lon: 16.12466,
                  lat: 61.842060000000025
                },
                %{
                  lon: 16.124609999999997,
                  lat: 61.84171000000003
                },
                %{
                  lon: 16.123969999999996,
                  lat: 61.838750000000026
                },
                %{
                  lon: 16.122879999999995,
                  lat: 61.83872000000002
                },
                %{
                  lon: 16.122119999999995,
                  lat: 61.83871000000002
                },
                %{
                  lon: 16.121819999999996,
                  lat: 61.83869000000002
                },
                %{
                  lon: 16.120559999999998,
                  lat: 61.83860000000002
                },
                %{
                  lon: 16.119419999999998,
                  lat: 61.83847000000002
                },
                %{
                  lon: 16.11864,
                  lat: 61.83836000000002
                },
                %{
                  lon: 16.11834,
                  lat: 61.838320000000024
                },
                %{
                  lon: 16.11797,
                  lat: 61.83827000000002
                },
                %{
                  lon: 16.11768,
                  lat: 61.838230000000024
                },
                %{
                  lon: 16.11707,
                  lat: 61.83815000000003
                },
                %{
                  lon: 16.11618,
                  lat: 61.838030000000025
                },
                %{
                  lon: 16.1153,
                  lat: 61.837870000000024
                },
                %{
                  lon: 16.114990000000002,
                  lat: 61.83782000000002
                },
                %{
                  lon: 16.114110000000004,
                  lat: 61.83770000000002
                },
                %{
                  lon: 16.112410000000004,
                  lat: 61.83754000000002
                },
                %{
                  lon: 16.111270000000005,
                  lat: 61.83741000000002
                },
                %{
                  lon: 16.110530000000004,
                  lat: 61.83729000000002
                },
                %{
                  lon: 16.109840000000005,
                  lat: 61.83714000000002
                },
                %{
                  lon: 16.108440000000005,
                  lat: 61.83677000000002
                },
                %{
                  lon: 16.106960000000004,
                  lat: 61.836490000000026
                },
                %{
                  lon: 16.105440000000005,
                  lat: 61.83632000000003
                },
                %{
                  lon: 16.104880000000005,
                  lat: 61.83629000000003
                },
                %{
                  lon: 16.104250000000004,
                  lat: 61.836150000000025
                },
                %{
                  lon: 16.103700000000003,
                  lat: 61.83598000000003
                },
                %{
                  lon: 16.103060000000003,
                  lat: 61.83554000000003
                },
                %{
                  lon: 16.102050000000002,
                  lat: 61.83487000000003
                },
                %{
                  lon: 16.10096,
                  lat: 61.83415000000003
                },
                %{
                  lon: 16.10046,
                  lat: 61.83382000000003
                },
                %{
                  lon: 16.09992,
                  lat: 61.83348000000003
                },
                %{
                  lon: 16.09943,
                  lat: 61.83318000000003
                },
                %{
                  lon: 16.0987,
                  lat: 61.832840000000026
                },
                %{
                  lon: 16.09748,
                  lat: 61.832300000000025
                },
                %{
                  lon: 16.09638,
                  lat: 61.83186000000003
                },
                %{
                  lon: 16.09462,
                  lat: 61.83112000000003
                },
                %{
                  lon: 16.09411,
                  lat: 61.830800000000025
                },
                %{
                  lon: 16.09357,
                  lat: 61.83045000000003
                },
                %{
                  lon: 16.09266,
                  lat: 61.829750000000026
                },
                %{
                  lon: 16.09219,
                  lat: 61.82940000000003
                },
                %{
                  lon: 16.091939999999997,
                  lat: 61.82922000000003
                },
                %{
                  lon: 16.091459999999998,
                  lat: 61.82886000000003
                },
                %{
                  lon: 16.091379999999997,
                  lat: 61.82887000000003
                },
                %{
                  lon: 16.091299999999997,
                  lat: 61.82887000000003
                },
                %{
                  lon: 16.091229999999996,
                  lat: 61.82885000000003
                },
                %{
                  lon: 16.091169999999995,
                  lat: 61.82883000000003
                },
                %{
                  lon: 16.091079999999994,
                  lat: 61.828880000000034
                },
                %{
                  lon: 16.090209999999995,
                  lat: 61.82914000000003
                },
                %{
                  lon: 16.089959999999994,
                  lat: 61.82922000000003
                },
                %{
                  lon: 16.089619999999993,
                  lat: 61.82931000000003
                },
                %{
                  lon: 16.089249999999993,
                  lat: 61.82942000000003
                },
                %{
                  lon: 16.088679999999993,
                  lat: 61.829570000000025
                },
                %{
                  lon: 16.087729999999993,
                  lat: 61.82980000000003
                },
                %{
                  lon: 16.087359999999993,
                  lat: 61.82987000000003
                },
                %{
                  lon: 16.087129999999995,
                  lat: 61.82991000000003
                },
                %{
                  lon: 16.086839999999995,
                  lat: 61.82994000000003
                },
                %{
                  lon: 16.086549999999995,
                  lat: 61.82997000000003
                },
                %{
                  lon: 16.086239999999997,
                  lat: 61.82999000000003
                },
                %{
                  lon: 16.085889999999996,
                  lat: 61.82999000000003
                },
                %{
                  lon: 16.085529999999995,
                  lat: 61.82997000000003
                },
                %{
                  lon: 16.085169999999994,
                  lat: 61.82994000000003
                },
                %{
                  lon: 16.084889999999994,
                  lat: 61.82989000000003
                },
                %{
                  lon: 16.084539999999993,
                  lat: 61.82985000000003
                },
                %{
                  lon: 16.083999999999993,
                  lat: 61.829750000000026
                },
                %{
                  lon: 16.08355999999999,
                  lat: 61.829680000000025
                },
                %{
                  lon: 16.08317999999999,
                  lat: 61.829610000000024
                },
                %{
                  lon: 16.082869999999993,
                  lat: 61.829550000000026
                },
                %{
                  lon: 16.08252999999999,
                  lat: 61.82945000000002
                },
                %{
                  lon: 16.082029999999992,
                  lat: 61.82926000000002
                },
                %{
                  lon: 16.081929999999993,
                  lat: 61.82929000000002
                },
                %{
                  lon: 16.081819999999993,
                  lat: 61.829300000000025
                },
                %{
                  lon: 16.081709999999994,
                  lat: 61.82929000000002
                },
                %{
                  lon: 16.081609999999994,
                  lat: 61.82926000000002
                },
                %{
                  lon: 16.081539999999993,
                  lat: 61.82922000000002
                },
                %{
                  lon: 16.081519999999994,
                  lat: 61.82917000000002
                },
                %{
                  lon: 16.081529999999994,
                  lat: 61.82912000000002
                },
                %{
                  lon: 16.081589999999995,
                  lat: 61.829070000000016
                },
                %{
                  lon: 16.081679999999995,
                  lat: 61.82904000000001
                },
                %{
                  lon: 16.081309999999995,
                  lat: 61.828820000000015
                },
                %{
                  lon: 16.081229999999994,
                  lat: 61.82877000000001
                },
                %{
                  lon: 16.080939999999995,
                  lat: 61.82859000000001
                },
                %{
                  lon: 16.080409999999993,
                  lat: 61.82825000000001
                },
                %{
                  lon: 16.080039999999993,
                  lat: 61.82807000000001
                },
                %{
                  lon: 16.079629999999995,
                  lat: 61.82796000000001
                },
                %{
                  lon: 16.079009999999993,
                  lat: 61.82789000000001
                },
                %{
                  lon: 16.078269999999993,
                  lat: 61.82789000000001
                },
                %{
                  lon: 16.077489999999994,
                  lat: 61.82794000000001
                },
                %{
                  lon: 16.075999999999993,
                  lat: 61.82807000000001
                },
                %{
                  lon: 16.074329999999993,
                  lat: 61.82827000000001
                },
                %{
                  lon: 16.074119999999994,
                  lat: 61.828280000000014
                },
                %{
                  lon: 16.073959999999992,
                  lat: 61.82821000000001
                },
                %{
                  lon: 16.073739999999994,
                  lat: 61.82807000000001
                },
                %{
                  lon: 16.073119999999992,
                  lat: 61.82767000000001
                },
                %{
                  lon: 16.072939999999992,
                  lat: 61.82755000000001
                },
                %{
                  lon: 16.07240999999999,
                  lat: 61.82724000000001
                },
                %{
                  lon: 16.06969999999999,
                  lat: 61.82545000000001
                },
                %{
                  lon: 16.06908999999999,
                  lat: 61.82514000000001
                },
                %{
                  lon: 16.068479999999987,
                  lat: 61.82483000000001
                },
                %{
                  lon: 16.063899999999986,
                  lat: 61.82266000000001
                },
                %{
                  lon: 16.063309999999987,
                  lat: 61.82234000000001
                },
                %{
                  lon: 16.062939999999987,
                  lat: 61.82212000000001
                },
                %{
                  lon: 16.062509999999985,
                  lat: 61.82183000000001
                },
                %{
                  lon: 16.062329999999985,
                  lat: 61.821680000000015
                },
                %{
                  lon: 16.062129999999986,
                  lat: 61.82149000000001
                },
                %{
                  lon: 16.061959999999985,
                  lat: 61.82140000000001
                },
                %{
                  lon: 16.061849999999986,
                  lat: 61.82137000000001
                },
                %{
                  lon: 16.061779999999985,
                  lat: 61.82135000000001
                },
                %{
                  lon: 16.061659999999986,
                  lat: 61.82136000000001
                },
                %{
                  lon: 16.061539999999987,
                  lat: 61.82135000000001
                },
                %{
                  lon: 16.060949999999988,
                  lat: 61.82140000000001
                },
                %{
                  lon: 16.060569999999988,
                  lat: 61.821410000000014
                },
                %{
                  lon: 16.06034999999999,
                  lat: 61.82142000000002
                },
                %{
                  lon: 16.060109999999987,
                  lat: 61.82142000000002
                },
                %{
                  lon: 16.059719999999988,
                  lat: 61.82140000000002
                },
                %{
                  lon: 16.05957999999999,
                  lat: 61.821390000000015
                },
                %{
                  lon: 16.05914999999999,
                  lat: 61.82138000000001
                },
                %{
                  lon: 16.05863999999999,
                  lat: 61.82137000000001
                },
                %{
                  lon: 16.05834999999999,
                  lat: 61.82138000000001
                },
                %{
                  lon: 16.05797999999999,
                  lat: 61.82140000000001
                },
                %{
                  lon: 16.05751999999999,
                  lat: 61.82144000000001
                },
                %{
                  lon: 16.05716999999999,
                  lat: 61.82148000000001
                },
                %{
                  lon: 16.05685999999999,
                  lat: 61.82153000000001
                },
                %{
                  lon: 16.05645999999999,
                  lat: 61.82161000000001
                },
                %{
                  lon: 16.05549999999999,
                  lat: 61.82184000000001
                },
                %{
                  lon: 16.05008999999999,
                  lat: 61.82328000000001
                },
                %{
                  lon: 16.04961999999999,
                  lat: 61.823400000000014
                },
                %{
                  lon: 16.04578999999999,
                  lat: 61.824230000000014
                },
                %{
                  lon: 16.04157999999999,
                  lat: 61.82509000000002
                },
                %{
                  lon: 16.039559999999987,
                  lat: 61.82532000000002
                },
                %{
                  lon: 16.037519999999986,
                  lat: 61.82535000000002
                },
                %{
                  lon: 16.036139999999985,
                  lat: 61.82528000000002
                },
                %{
                  lon: 16.035659999999986,
                  lat: 61.82627000000002
                },
                %{
                  lon: 16.035649999999986,
                  lat: 61.82642000000002
                },
                %{
                  lon: 16.035669999999985,
                  lat: 61.82659000000002
                },
                %{
                  lon: 16.035729999999987,
                  lat: 61.82675000000002
                },
                %{
                  lon: 16.035819999999987,
                  lat: 61.82694000000002
                },
                %{
                  lon: 16.035929999999986,
                  lat: 61.82709000000002
                },
                %{
                  lon: 16.036009999999987,
                  lat: 61.82718000000002
                },
                %{
                  lon: 16.036049999999985,
                  lat: 61.82723000000002
                },
                %{
                  lon: 16.036289999999987,
                  lat: 61.82745000000002
                },
                %{
                  lon: 16.036659999999987,
                  lat: 61.82772000000002
                },
                %{
                  lon: 16.037049999999986,
                  lat: 61.82798000000002
                },
                %{
                  lon: 16.037709999999986,
                  lat: 61.82843000000002
                },
                %{
                  lon: 16.038269999999986,
                  lat: 61.82870000000002
                },
                %{
                  lon: 16.039849999999987,
                  lat: 61.82931000000002
                },
                %{
                  lon: 16.041369999999986,
                  lat: 61.82985000000002
                },
                %{
                  lon: 16.042549999999988,
                  lat: 61.83019000000002
                },
                %{
                  lon: 16.043329999999987,
                  lat: 61.83034000000002
                },
                %{
                  lon: 16.044179999999987,
                  lat: 61.83050000000002
                },
                %{
                  lon: 16.044559999999986,
                  lat: 61.83058000000002
                },
                %{
                  lon: 16.044919999999987,
                  lat: 61.83070000000002
                },
                %{
                  lon: 16.045169999999988,
                  lat: 61.830820000000024
                },
                %{
                  lon: 16.045479999999987,
                  lat: 61.830980000000025
                },
                %{
                  lon: 16.044989999999988,
                  lat: 61.83113000000002
                },
                %{
                  lon: 16.044729999999987,
                  lat: 61.831180000000025
                },
                %{
                  lon: 16.044619999999988,
                  lat: 61.831180000000025
                }
              ]
            },
            duration: 1329.9,
            distance: 14763.5
          },
          pickup: %{
            lon: 16.143637,
            lat: 61.906519
          },
          metadata: %{
            sender: %{
              contact: "0701234567"
            },
            recipient: %{
              contact: "0701234567"
            }
          },
          id: "pmb-1FECmfgs",
          external_id: 85148,
          events: [
            %{
              type: "new",
              timestamp: "2020-09-14T13:38:21.094059Z"
            }
          ],
          delivery: %{
            lon: 16.044623,
            lat: 61.831175
          },
          assigned_to: nil
        }
      ]
    }
  end
end
