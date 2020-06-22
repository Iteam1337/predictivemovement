// Author: Simon Lundell, lundell3@gmail.com
// Copyright (c) 2020 Simon Lundell
// License: MIT License as follows:
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// =============================================================================
// Javascript-implementation of "Gauss Conformal Projection
// (Transverse Mercator), Krügers Formulas".
// - Parameters for SWEREF99 lat-long to/from RT90 and SWEREF99
//   coordinates (RT90 and SWEREF99 are used in Swedish maps).
// Source: http://www.lantmateriet.se/geodesi/

const axis = 6378137.0
const flattening = 1.0 / 298.257222101
const central_meridian = 15.0
const scale = 0.9996
const false_northing = 0.0
const false_easting = 500000.0

function grid_to_geodetic(x, y) {
  const lat_lon = new Array(2)
  if (central_meridian == null) {
    return lat_lon
  }
  // Prepare ellipsoid-based stuff.
  const e2 = flattening * (2.0 - flattening)
  const n = flattening / (2.0 - flattening)
  const a_roof =
    (axis / (1.0 + n)) * (1.0 + (n * n) / 4.0 + (n * n * n * n) / 64.0)
  const delta1 =
    n / 2.0 -
    (2.0 * n * n) / 3.0 +
    (37.0 * n * n * n) / 96.0 -
    (n * n * n * n) / 360.0
  const delta2 =
    (n * n) / 48.0 + (n * n * n) / 15.0 - (437.0 * n * n * n * n) / 1440.0
  const delta3 = (17.0 * n * n * n) / 480.0 - (37 * n * n * n * n) / 840.0
  const delta4 = (4397.0 * n * n * n * n) / 161280.0

  const Astar = e2 + e2 * e2 + e2 * e2 * e2 + e2 * e2 * e2 * e2
  const Bstar =
    -(7.0 * e2 * e2 + 17.0 * e2 * e2 * e2 + 30.0 * e2 * e2 * e2 * e2) / 6.0
  const Cstar = (224.0 * e2 * e2 * e2 + 889.0 * e2 * e2 * e2 * e2) / 120.0
  const Dstar = -(4279.0 * e2 * e2 * e2 * e2) / 1260.0

  // Convert.
  const deg_to_rad = Math.PI / 180
  const lambda_zero = central_meridian * deg_to_rad
  const xi = (x - false_northing) / (scale * a_roof)
  const eta = (y - false_easting) / (scale * a_roof)
  const xi_prim =
    xi -
    delta1 * Math.sin(2.0 * xi) * math_cosh(2.0 * eta) -
    delta2 * Math.sin(4.0 * xi) * math_cosh(4.0 * eta) -
    delta3 * Math.sin(6.0 * xi) * math_cosh(6.0 * eta) -
    delta4 * Math.sin(8.0 * xi) * math_cosh(8.0 * eta)
  const eta_prim =
    eta -
    delta1 * Math.cos(2.0 * xi) * math_sinh(2.0 * eta) -
    delta2 * Math.cos(4.0 * xi) * math_sinh(4.0 * eta) -
    delta3 * Math.cos(6.0 * xi) * math_sinh(6.0 * eta) -
    delta4 * Math.cos(8.0 * xi) * math_sinh(8.0 * eta)
  const phi_star = Math.asin(Math.sin(xi_prim) / math_cosh(eta_prim))
  const delta_lambda = Math.atan(math_sinh(eta_prim) / Math.cos(xi_prim))
  const lon_radian = lambda_zero + delta_lambda
  const lat_radian =
    phi_star +
    Math.sin(phi_star) *
      Math.cos(phi_star) *
      (Astar +
        Bstar * Math.pow(Math.sin(phi_star), 2) +
        Cstar * Math.pow(Math.sin(phi_star), 4) +
        Dstar * Math.pow(Math.sin(phi_star), 6))
  lat_lon[0] = (lat_radian * 180.0) / Math.PI
  lat_lon[1] = (lon_radian * 180.0) / Math.PI
  return lat_lon
}

function math_sinh(value) {
  return 0.5 * (Math.exp(value) - Math.exp(-value))
}
function math_cosh(value) {
  return 0.5 * (Math.exp(value) + Math.exp(-value))
}

module.exports = grid_to_geodetic
