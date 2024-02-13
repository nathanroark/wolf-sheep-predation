//------------------------------------------------------------------------------
// Author:  Nathan Roark
// School:  The University of Alabama in Huntsville
// Program: Wolf-Sheep Predation (Program 3)
// Course:  CS 582, Modeling and Simulation 2
// Date:    06 March 2023
//------------------------------------------------------------------------------

import { sample } from "@/helpers/Statistics"
import type { WSP_State, agent, cell } from "@/types/types"
import type { SetStateAction } from "react"

const cells_x = 40
const cells_y = 40

const init_wolves = 40 // Number of wolves at start;
const init_sheep = 80 // Number of sheep at start;
const init_prob_grass = 0.5 // Probability cell is initially grass;
const init_energy_wolves = 40 // Max initial energy for each wolf;
const init_energy_sheep = 8 // Max initial energy for each sheep;
const move_loss = 1 // Cost for move, wolf and sheep;
const eat_gain_wolf = 20 // Wolf gain for eating sheep;
const eat_gain_sheep = 4 // Sheep gain for eating grass;
const repro_prob_wolf = 0.05 // Probability wolf reproduces;
const repro_prob_sheep = 0.04 // Probability sheep reproduces;
const regrow_time_grass = 30 // Time steps required to regrow grass;

const move_x = [1, 1, 0, -1, -1, -1, 0, 1] // Change to x coordinate for each move direction
const move_y = [0, 1, 1, 1, 0, -1, -1, -1] // Change to y coordinate for each move direction
const direction_left = [1, 2, 3, 4, 5, 6, 7, 0] // New direction when turning left for each move directiolet
const direction_right = [7, 0, 1, 2, 3, 4, 5, 6] // New direction when turning right for each move directilet

/**
 * Get Agents
 * - get indexes of agents of a specific type that are in a cell
 *
 * @param type - type of agent to look for
 * @param x - x location of cell
 * @param y - y location opf
 * @param agents - array of all agents in the simulation
 * @returns - an array of agents corresponding to the specified cell
 */
const GetAgents = (
  type: "wolf" | "sheep",
  x: number,
  y: number,
  agents: agent[]
) => {
  const agent_indexes: number[] = []
  if (agents.length > 0) {
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]
      if (agent.type == type && agent.x == x && agent.y == y) {
        agent_indexes.push(i)
      }
    }
  }
  return agent_indexes
}

/**
 * Wolf Sheep Predation
 *  - wolf sheep predation model simulation using agent based simulation
 *
 * @param trial - the trial number of this is getting ran in the test
 * @returns - Results of the simulation trial along with a grid of each clock of the sim
 */
export const WSP_Step = (state: WSP_State) => {
  const clock = state.clock
  const cells = state.cells
  const agents = state.agents
  const output = state.output
  const grid = state.grid
  // Utility functions
  //----------------------------------------------------------------------
  function AgentInCell(x: number, y: number) {
    for (const agent of agents) {
      if (agent.x === x && agent.y === y) {
        return true
      }
    }
    return false
  }

  function GetAgentInCell(x: number, y: number) {
    for (const agent of agents) {
      if (agent.x === x && agent.y === y) {
        return agent.type
      }
    }
    return ""
  }

  //----------------------------------------------------------------------

  if (clock == 0) {
    // Stochastic Initialization
    //-------------------------------------------------------------
    // Initialize terrain.
    for (let i = 0; i < cells_x; i++) {
      const row: cell[] = new Array<cell>()
      for (let j = 0; j < cells_y; j++) {
        if (Math.random() < init_prob_grass) {
          row.push({ terrain: "grass", regrow: 0, x: i, y: j }) // Cell initially grass ...
        } else {
          // Cell initially dirt ...
          row.push({
            terrain: "dirt",
            regrow: sample(regrow_time_grass, 1)[0] - 1,
            x: i,
            y: j,
          })
        }
      }

      cells.push(row)
    }

    // Initialize agents.
    let i = 0
    while (i < init_wolves + init_sheep) {
      const x = sample(cells_x, 1)[0] - 1
      const y = sample(cells_y, 1)[0] - 1
      const type: "wolf" | "sheep" = i < init_wolves ? "wolf" : "sheep"
      const agent: agent = {
        type: type,
        x: x,
        y: y,
        direction: sample(8, 1)[0] - 1,
        energy:
          type == "wolf"
            ? sample(init_energy_wolves, 1)[0]
            : sample(init_energy_sheep, 1)[0],
      }
      if (!AgentInCell(agent.x, agent.y)) {
        agents.push(agent)
        i += 1
      }
    }
    //-------------------------------------------------------------

    // Record initial state
    for (let i = 0; i < cells_x; i++) {
      const gridRow: string[] = []
      for (let j = 0; j < cells_y; j++) {
        if (AgentInCell(i, j)) {
          if (GetAgentInCell(i, j) == "wolf") gridRow.push("wolf")
          else gridRow.push("sheep")
        } else if (cells[i][j].terrain == "grass") {
          gridRow.push("grass")
        } else if (cells[i][j].terrain == "dirt") {
          gridRow.push("dirt")
        }
      }
      grid.push(gridRow)
    }
    let cur_wolves = 0
    let cur_sheep = 0
    const cur_grass = 0

    // record desired states for output
    const new_grid: string[][] = []
    for (let i = 0; i < cells_x; i++) {
      const gridRow: string[] = []
      for (let j = 0; j < cells_y; j++) {
        if (AgentInCell(i, j)) {
          if (GetAgentInCell(i, j) == "wolf") gridRow.push("wolf")
          else gridRow.push("sheep")
        } else if (cells[i][j].terrain == "grass") {
          gridRow.push("grass")
        } else if (cells[i][j].terrain == "dirt") {
          gridRow.push("dirt")
        }
      }
      new_grid.push(gridRow)
    }

    for (const agent of agents) {
      if (agent.type === "wolf") cur_wolves += 1
      else if (agent.type === "sheep") cur_sheep += 1
    }
    const val: SetStateAction<WSP_State> = {
      clock: clock + 1,
      cells: cells,
      agents: agents,
      output: output,
      grid: grid,
      sheep: cur_sheep,
      wolves: cur_wolves,
      grass: cur_grass,
      dirt: cells_x * cells_y - cur_grass,
    }

    return val
  }

  // Grass regrows?
  // Dirt cells become grass after a fixed time.
  for (let i = 0; i < cells_x; i++) {
    for (let j = 0; j < cells_y; j++) {
      if (cells[i][j].terrain == "dirt") {
        cells[i][j].regrow -= 1 // decrement time to regrow by one clock
        if (cells[i][j].regrow == 0) {
          // if the grass regrow timer is up
          cells[i][j].terrain = "grass"
        }
      }
    }
  }

  // Move each agent and reduce the agent's energy for the movement.
  // For movement the terrain cell grid is treated as a torus,
  // i.e., cells on the right edge are adjacent to cells on the left edge,
  // and cells on the bottom are adjacent to cells on the top.
  if (agents.length > 0) {
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i] // Retrieve agent from agents list
      const roll_d = Math.random()
      const next_d =
        roll_d < 0.2
          ? direction_left[agent.direction]
          : roll_d < 0.8
            ? agent.direction
            : direction_right[agent.direction]
      agent.direction = next_d // Randomly choose agent's movement direction
      agent.x = agent.x + move_x[agent.direction] // Change agent's x coordinate for move
      agent.y = agent.y + move_y[agent.direction] // Change agent's y coordinate for move
      if (agent.x >= cells_x) {
        agent.x = 0
      } // Move off right edge onto left edge
      if (agent.x < 0) {
        agent.x += cells_x - 1
      } // Move off left edge onto right edge
      if (agent.y >= cells_y) {
        agent.y = 0
      } // Move off top edge onto bottom edge
      if (agent.y < 0) {
        agent.y += cells_y - 1
      } // Move off bottom edge onto top edge
      agent.energy = agent.energy - move_loss // Reduce agent's energy by cost of movement
      agents[i] = agent // Update agent
    }
  }

  // Wolves eat sheep?
  // If a wolf and a sheep are in the same cell, the wolf eats the sheep.
  // If there are multiple wolves, the wolf that eats is chosen randomly.
  // If there are multiple sheep, the sheep that is eaten is chosen randomly.
  // The eating continues as long as there are any sheep in the cell; a wolf may eat multiple sheep.
  for (let i = 0; i < cells_x; i++) {
    for (let j = 0; j < cells_y; j++) {
      let wolves_in_cell = GetAgents("wolf", i, j, agents) // shallow copy (getting references to original agents)
      let sheep_in_cell = GetAgents("sheep", i, j, agents) // shallow copy (getting references to original agents)
      while (wolves_in_cell.length > 0 && sheep_in_cell.length > 0) {
        const wolf = sample(wolves_in_cell)[0] // Randomly select wolf from those in cell
        const sheep = sample(sheep_in_cell)[0] // Randomly select sheep from those in cell
        agents[wolf].energy += eat_gain_wolf // Add energy to wolf
        agents.splice(sheep, 1) // Remove sheep from agents list}
        wolves_in_cell = GetAgents("wolf", i, j, agents) // shallow copy (getting references to original agents)
        sheep_in_cell = GetAgents("sheep", i, j, agents) // shallow copy (getting references to original agents)
      }
    }
  }

  // Sheep eat grass?
  // If there is a sheep in a grass cell, the sheep eats the grass and the cell is changed to dirt.
  // Only one sheep may eat the grass in a cell.
  // If there are multiple sheep, the one that eats is chosen randomly.
  for (let i = 0; i < cells_x; i++) {
    for (let j = 0; j < cells_y; j++) {
      const sheep_in_cell = GetAgents("sheep", i, j, agents) // shallow copy (getting references to original agents)
      if (sheep_in_cell.length == 0) continue
      const sheep = sample(sheep_in_cell)[0] // Randomly select sheep from those in cell
      const s: agent = agents[sheep]
      if (cells[s.x][s.y].terrain == "grass") {
        // At least one sheep in a grass cell
        agents[sheep].energy += eat_gain_sheep // Randomly select sheep from those in cell
        cells[s.x][s.y].terrain = "dirt" // Change grass to dirt
        cells[s.x][s.y].regrow = regrow_time_grass // Set regrow counter
      }
    }
  }

  // Agents reproduce?
  // Agents reproduce by fission and randomly, with given probability.
  // Offspring agents are "clones", i.e., copies of the "parent" agent,
  // except that a random movement direction is assigned to the offspring agent
  // and the parent's energy is split between parent and offspring agents.
  // Offspring agents start in the same cell as their parent agent.
  if (agents.length > 0) {
    const originalAgentsLength = agents.length
    for (let i = 0; i < originalAgentsLength; i++) {
      const a: agent = agents[i] // Retrieve agent from agents list
      const repro_prob = a.type == "wolf" ? repro_prob_wolf : repro_prob_sheep
      if (Math.random() < repro_prob) {
        const agent: agent = {
          type: a.type,
          x: a.x,
          y: a.y,
          direction: sample(8, 1)[0] - 1,
          energy: Math.floor(a.energy / 2),
        }
        agents.push(agent)
        a.energy = Math.ceil(a.energy / 2) // Agent loses half its energy
      }
    }
  }

  // Agents starve?
  // Any agent with energy <= 0 starves and is removed from the simulation.
  if (agents.length > 0) {
    const removeValFromIndex: number[] = []
    for (let i = 0; i < agents.length; i++) {
      if (agents[i].energy <= 0) {
        removeValFromIndex.push(i)
      }
    }
    for (const i of removeValFromIndex.reverse()) {
      agents.splice(i, 1)
    }
  }

  // Calculate statistics
  // --------------------------------------------
  // reset counters
  let cur_wolves = 0
  let cur_sheep = 0
  let cur_grass = 0

  // record desired states for output
  const new_grid: string[][] = []
  for (let i = 0; i < cells_x; i++) {
    const gridRow: string[] = []
    for (let j = 0; j < cells_y; j++) {
      if (AgentInCell(i, j)) {
        if (GetAgentInCell(i, j) == "wolf") gridRow.push("wolf")
        else gridRow.push("sheep")
      } else if (cells[i][j].terrain == "grass") {
        gridRow.push("grass")
      } else if (cells[i][j].terrain == "dirt") {
        gridRow.push("dirt")
      }
    }
    new_grid.push(gridRow)
  }
  for (let i = 0; i < cells_x; i++) {
    for (let j = 0; j < cells_y; j++) {
      if (cells[i][j].terrain === "grass") {
        cur_grass += 1
      }
    }
  }

  for (const agent of agents) {
    if (agent.type === "wolf") cur_wolves += 1
    else if (agent.type === "sheep") cur_sheep += 1
  }

  const val: SetStateAction<WSP_State> = {
    clock: clock + 1,
    cells: cells,
    agents: agents,
    output: output,
    grid: new_grid,
    sheep: cur_sheep,
    wolves: cur_wolves,
    grass: cur_grass,
    dirt: cells_x * cells_y - cur_grass,
  }

  return val
}
