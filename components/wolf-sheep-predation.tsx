"use client"

import Link from "next/link"
import React, { useRef, useState, useCallback } from "react"
import { WSP_Step } from "./wsp"
import type { WSP_State, agent, cell } from "@/types/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetFooter,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet"

import { buttonVariants } from "@/components/ui/button"
const cellColor = (cell: string) => {
  if (cell == "dirt") return "bg-[#2f2f2f]"
  if (cell == "grass") return "bg-[#38473c]"
  if (cell == "sheep") return "bg-[#888888]"
  if (cell == "wolf") return "bg-[#44596f]"
  // if (cell == "wolf") return "bg-[#6a3737]"
}

const textColor = (cell: string) => {
  if (cell == "dirt") return "text-[#393633]"
  if (cell == "grass") return "text-[#38473c]"
  if (cell == "sheep") return "text-[#888888]"
  if (cell == "wolf") return "text-[#44596f]"
}

export const WolfSheepPredation: React.FC = () => {
  const [running, setRunning] = useState(false)
  const runningRef = useRef(running)
  const [state, setState] = useState<WSP_State>({
    grid: [],
    clock: 0,
    cells: new Array<Array<cell>>(),
    agents: new Array<agent>(),
    output: new Array<string>(),
    sheep: 0,
    wolves: 0,
    grass: 0,
    dirt: 0,
  })

  runningRef.current = running
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return
    setState((s) => WSP_Step(s))
    setTimeout(runSimulation, 100)
  }, [])

  return (
    <Sheet>
      <div className="flex flex-col items-center justify-center text-xs sm:text-sm md:text-lg">
        <div className="flex space-x-2 pb-2">
          <Button
            variant="outline"
            onClick={() => {
              setRunning(!running)
              if (!running) {
                runningRef.current = true
                runSimulation()
              }
            }}
          >
            {running ? "Stop" : "Start"}
          </Button>
          <Button variant="outline" onClick={() => setState(WSP_Step(state))}>
            Step
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setState({
                grid: [],
                clock: 0,
                cells: new Array<Array<cell>>(),
                agents: new Array<agent>(),
                output: new Array<string>(),
                sheep: 0,
                wolves: 0,
                grass: 0,
                dirt: 0,
              })
            }
          >
            Clear
          </Button>

          <SheetTrigger asChild>
            <Button variant="outline">Stats</Button>
          </SheetTrigger>
          <Button asChild variant="outline">
            <Link href="/about">About</Link>
          </Button>
          <SheetContent>
            <SheetHeader className="pb-6">
              <SheetTitle>Run Statistics</SheetTitle>
              <SheetDescription>
                Wolf Sheep Predation Simulation
              </SheetDescription>
            </SheetHeader>
            <div className="flex w-full flex-col gap-8 text-xl font-bold">
              <div className="flex  flex-col">
                <div className="flex items-center justify-start gap-2">
                  <div className={cn("size-5", cellColor("wolf"))}></div>
                  <a className={cn("text-xl", textColor("wolf"))}>
                    Blue - Wolf
                  </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className={cn("size-5", cellColor("sheep"))}></div>
                  <a className={cn("text-xl", textColor("sheep"))}>
                    White - Sheep
                  </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className={cn("size-5", cellColor("grass"))}></div>
                  <a className={cn("text-xl", textColor("grass"))}>
                    Green - Grass
                  </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className={cn("size-5", cellColor("dirt"))}></div>
                  <a className={cn("text-xl", textColor("dirt"))}>
                    Brown - Dirt
                  </a>
                </div>
              </div>
              <div className="w-40 pr-2">
                <div className="flex justify-between xl:w-full">
                  <div>clock</div> <div>{state.clock}</div>
                </div>
                <div className="flex justify-between xl:w-full">
                  <div>wolves </div>
                  <div>{state.wolves}</div>
                </div>
                <div className="flex justify-between xl:w-full">
                  <div>sheep</div> <div>{state.sheep}</div>
                </div>
                <div className="flex justify-between xl:w-full">
                  grass <div>{state.grass}</div>
                </div>
                <div className="flex justify-between xl:w-full">
                  dirt <div>{state.dirt}</div>
                </div>
              </div>
            </div>
            <SheetFooter className="pt-4">
              <Button asChild variant="outline">
                <Link href="/about">About</Link>
              </Button>
            </SheetFooter>
          </SheetContent>
        </div>
        {state.grid.length > 0 ? (
          <div className="grid size-fit grid-cols-40 border border-black">
            {state.grid.map((rows, i) =>
              rows.map((_, k) => (
                <div
                  className={cn(
                    "size-3 border border-black lg:size-4 xl:size-5",
                    cellColor(state.grid[i][k])
                  )}
                  key={`${i}-${k}`}
                />
              ))
            )}
          </div>
        ) : (
          <div className="grid size-fit grid-cols-40 border border-black">
            {Array.from({ length: 40 }, (_, index) =>
              Array.from({ length: 40 }, (_, index2) => (
                <div
                  className="size-3 border border-black bg-gray-900 lg:size-4 xl:size-5"
                  key={`${index}-${index2}`}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Sheet>
  )
}
