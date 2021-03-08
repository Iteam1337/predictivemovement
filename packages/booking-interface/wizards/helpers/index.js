const jumpToStep = (ctx, name) => {
  ctx.wizard.next()
  ctx.wizard.steps
    .filter((x) => Boolean(x.name))
    .find((handler) => handler.name === name)(ctx)
}

const forceNext = (ctx) => {
  ctx.wizard.next()
  ctx.wizard.steps[ctx.wizard.cursor](ctx)
}

module.exports = { jumpToStep, forceNext }
