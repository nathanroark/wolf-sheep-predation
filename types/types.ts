export type agent = {
  type: "wolf" | "sheep" // possible types of agents
  x: number // x location
  y: number // y location
  direction: number // direction of travel
  energy: number // energy remaining until death
}

export type terrain = "grass" | "dirt" // possible states of the terrain

export type cell = {
  x: number // x location
  y: number // y location
  terrain: terrain // possible terrain states
  regrow: number // time left until regrown if terrain is dirt
}
export type WSP_State = {
  clock: number
  cells: Array<Array<cell>>
  agents: agent[]
  output: string[]
  grid: string[][]
  sheep: number
  wolves: number
  grass: number
  dirt: number
}
