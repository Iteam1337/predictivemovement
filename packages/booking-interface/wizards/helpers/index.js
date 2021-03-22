const jumpToStep = (ctx, name, runNext = true) => {
  if (runNext) {
    ctx.wizard.next()
  }

  ctx.wizard.steps
    .filter((x) => Boolean(x.name))
    .find((handler) => handler.name === name)(ctx)
}

const jumpToComposerStep = (ctx, name) => {
  return ctx.wizard.steps
    .filter((x) => Boolean(x.name))
    .find((handler) => handler.name === name)
    .handler(ctx)
}

const forceNext = (ctx) => {
  ctx.wizard.next()
  ctx.wizard.steps[ctx.wizard.cursor](ctx)
}

module.exports = { jumpToStep, forceNext, jumpToComposerStep }
