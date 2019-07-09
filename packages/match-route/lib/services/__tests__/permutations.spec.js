const gen = positionsArray => {
  const perms = array => {
    if (!Array.isArray(array) || !array.length) {
      return [[]]
    }

    return array.concat.apply(
      [],
      array.map((value, i) =>
        perms([...array.slice(0, i), ...array.slice(i + 1)]).map(inner => [
          value,
          ...inner,
        ])
      )
    )
  }

  const values = positionsArray.reduce(
    (array, { start, end }, i) =>
      array.concat(
        { i, position: start.position, which: 'start' },
        { i, position: end.position, which: 'end' }
      ),
    []
  )

  return perms(values)
    .filter(
      value =>
        value.some((x, i, array) => {
          const left = array
            .slice(0, i)
            .some(y => y.i === x.i && y.which === 'end')
          const right = array
            .slice(Math.max(i + 1, array.length) - 1, array.length)
            .some(y => y.i === x.i && y.which === 'start')

          return left || right
        }) === false
    )
    .map(array => array.map(({ position }) => position))
}

xdescribe('permutations', () => {
  it('does as intended', () => {
    const personB = {
      start: {
        position: {
          lat: 0.0,
          lon: 1.0,
        },
      },
      end: {
        position: {
          lat: 2.0,
          lon: 3.0,
        },
      },
    }

    const personC = {
      start: {
        position: {
          lat: 4.0,
          lon: 5.0,
        },
      },
      end: {
        position: {
          lat: 6.0,
          lon: 7.0,
        },
      },
    }

    expect(gen([personB, personC])).toEqual(
      expect.arrayContaining([
        [
          { lat: 0, lon: 1 },
          { lat: 2, lon: 3 },
          { lat: 4, lon: 5 },
          { lat: 6, lon: 7 },
        ],
        [
          { lat: 0, lon: 1 },
          { lat: 4, lon: 5 },
          { lat: 2, lon: 3 },
          { lat: 6, lon: 7 },
        ],
        [
          { lat: 0, lon: 1 },
          { lat: 4, lon: 5 },
          { lat: 6, lon: 7 },
          { lat: 2, lon: 3 },
        ],
        [
          { lat: 4, lon: 5 },
          { lat: 0, lon: 1 },
          { lat: 2, lon: 3 },
          { lat: 6, lon: 7 },
        ],
        [
          { lat: 4, lon: 5 },
          { lat: 0, lon: 1 },
          { lat: 6, lon: 7 },
          { lat: 2, lon: 3 },
        ],
        [
          { lat: 4, lon: 5 },
          { lat: 6, lon: 7 },
          { lat: 0, lon: 1 },
          { lat: 2, lon: 3 },
        ],
      ])
    )
  })
})
