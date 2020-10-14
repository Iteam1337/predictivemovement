import { RecoilState, selector } from 'recoil'
import atoms from './atoms'
import reducers from './reducers'

const reducerSelector = <T, U>({
  selectorKey,
  selectorAtom,
  reducer,
}: {
  selectorKey: string
  selectorAtom: RecoilState<T>
  reducer: (args: T, action: U) => T
}) =>
  selector<T>({
    key: selectorKey,
    get: ({ get }) => get(selectorAtom),
    set: ({ get, set }, action) => {
      set(selectorAtom, reducer(get(selectorAtom), (action as unknown) as U))
    },
  })

const UIState = reducerSelector({
  selectorKey: 'uiselector',
  selectorAtom: atoms.ui,
  reducer: reducers.UIState,
})

export default { UIState }
