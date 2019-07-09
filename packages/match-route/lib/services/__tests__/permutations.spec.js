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
    (array, part, i) =>
      array.concat(
        { i, position: part[0], which: 'lon' },
        { i, position: part[1], which: 'lat' }
      ),
    []
  )

  return perms(values)
    .filter(value => {
      const disallowedOrder = value.some((x, i, array) => {
        const left = array.slice(0, i).some(y => y.i === x.i && y.which === 'lat')
        const right = array
          .slice(Math.max(i + 1, array.length) - 1, array.length)
          .some(y => y.i === x.i && y.which === 'lon')

        return left || right
      })

      return disallowedOrder === false
    })
    .map(array => array.map(({ position }) => position))
}

xdescribe('permutations', () => {
  it('does as intended', () => {
    expect(gen([['a1', 'a2'], ['b1', 'b2']])).toEqual([
      ['a1', 'a2', 'b1', 'b2'],
      ['a1', 'b1', 'a2', 'b2'],
      ['a1', 'b1', 'b2', 'a2'],
      ['b1', 'a1', 'a2', 'b2'],
      ['b1', 'a1', 'b2', 'a2'],
      ['b1', 'b2', 'a1', 'a2'],
    ])
  })
})
