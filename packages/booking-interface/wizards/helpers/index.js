const jumpToStep = (ctx, name) => {
  ctx.wizard.cursor =
    ctx.wizard.steps.findIndex((handler) => handler.name === name) - 1

  ctx.wizard.next()

  ctx.wizard.steps
    .filter((x) => Boolean(x.name))
    .find((handler) => handler.name === name)(ctx)
}

const jumpToComposerStep = (ctx, name) =>
  ctx.wizard.steps
    .filter((x) => Boolean(x.name))
    .find((handler) => handler.name === name)
    .handler(ctx)

const forceNext = (ctx) => {
  ctx.wizard.next()
  ctx.wizard.steps[ctx.wizard.cursor](ctx)
}

module.exports = { jumpToStep, forceNext, jumpToComposerStep }
