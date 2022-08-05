import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

export interface IStop {
  seq: string
  stop: string
  name_en: string
  name_tc: string
  name_sc: string
  lat: string
  long: string
}

export interface IRoute {
  route: string
  bound: 'I' | 'O' // I = inbound, O = outbound
  service_type: string
  orig_en: string
  orig_tc: string
  orig_sc: string
  dest_en: string
  dest_tc: string
  dest_sc: string
}

export interface BusState {
  routeNumList: string[]
  routes: IRoute[]
  route: {
    route: string
    directions: IRoute[]
  }
  stops: IStop[]
  stop: IStop
}

/**
 * Default state object with initial values.
 */
const initialState: BusState = {
  routeNumList: null,
  routes: null,
  route: null,
  stops: null,
  stop: null,
} as const

/**
 * Create a slice as a reducer containing actions.
 *
 * In this example actions are included in the slice. It is fine and can be
 * changed based on your needs.
 */
export const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setRoutes: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.routes>
    ) => {
      state.routes = action.payload
    },
    setRouteNumList: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.routeNumList>
    ) => {
      state.routeNumList = action.payload
    },
    setRoute: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.route>
    ) => {
      state.route = action.payload
    },
    setStops: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.stops>
    ) => {
      state.stops = action.payload
    },
    setStop: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.stop>
    ) => {
      state.stop = action.payload
    },
  },
})

// A small helper of bus state for `useSelector` function.
export const getBusState = (state: { bus: BusState }) => state.bus

// Exports all actions
export const { setRoutes, setRouteNumList, setStop, setRoute, setStops } =
  busSlice.actions

export default busSlice.reducer
