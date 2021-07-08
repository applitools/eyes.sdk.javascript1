import type * as types from '@applitools/types'

export function makeSDK<TDriver, TContext, TElement, TSelector>(options: {
  name: string
  version: string
  spec: types.SpecDriver<TDriver, TContext, TElement, TSelector>
  VisualGridClient: any
}): types.Core<TDriver, TElement, TSelector>

export const TestResultsFormatter: any
export const ConfigUtils: any
