import Link from "next/link"

const About = () => {
  return (
    <section className="float-right  w-full p-4  pb-32 pt-16 lg:w-[calc(100vw-18rem)] lg:px-32 lg:pb-64">
      <article className="md:prose-md prose dark:prose-invert lg:prose-lg xl:prose-xl 2xl:prose-2xl">
        <h1>Wolf Sheep Predation</h1>

        <h3>
          <Link href={`/`}>Simulation Link</Link>
        </h3>

        <h3>Based on Project Work given by Dr. Mikel D. Petty</h3>
        {/*
        <h4>
          This model is a predator-prey model, based on the Lotka-Volterra
          model. It is a classic example of agent-based modeling developed by
          Craig Reynolds. The model is a simulation of grass, sheep, and wolves
          in a field. The sheep eat grass and wolves eat sheep. The model shows
          how populations of sheep and wolves interact with each other, and how
          the populations interact with the grass. The model is a simulation of
          a simplified ecosystem, so the interactions are not meant to be
          realistic, but rather to show how populations are affected by the
          interactions. The model is a simulation of a simplified ecosystem, so
          the interactions are not meant to be realistic, but rather to show how
          populations are affected by the interactions.
        </h4> */}

        <h2>Simuland</h2>

        <ul>
          <li>Predator-prey ecosystem</li>
          <li>Wolves eat sheep</li>
          <li>Sheep eat grass, turning grass to dirt</li>
          <li>Grass regrows, after time has passed</li>
          <li>Movement requires energy</li>
          <li>Wolves and sheep starve if they don’t eat enough</li>
        </ul>

        <h2>Abstractions and assumptions</h2>

        <ul>
          <li>Wolf and sheep locations discretized</li>
          <li>
            Wolves and sheep move randomly;
            <ul>
              <li>i.e., wolves don’t pursue sheep, sheep don’t evade wolves</li>
            </ul>
          </li>
          <li>Wolves and sheep move at same speed</li>
          <li>Sheep and wolves move individually (no flocks or packs)</li>
          <li>Wolves and sheep reproduce by “fission”</li>
        </ul>

        <h2>Agents</h2>

        <ul>
          <li>Types: (wolf, sheep)</li>
          <li>Attributes (both types): x, y, movement direction, energy</li>
        </ul>

        <h2>Environment</h2>

        <ul>
          <li>2D grid of square cells, 50  50</li>
          <li>
            Grid treated as torus, i.e, right edge adjacent to left edge,
            <ul>
              <li>top edge adjacent to bottom edge</li>
            </ul>
          </li>
          <li>Cell states: (grass, dirt); if dirt, also a regrow counter</li>
          <li>Agents located in cells; multiple agents may be in same cell</li>
        </ul>

        <h2>Interactions</h2>

        <ul>
          <li>
            Sheep-Grass: if sheep agent in grass cell, then sheep eats grass;
            <ul>
              <li>cell becomes dirt cell, sheep gains energy</li>
            </ul>
          </li>
          <li>
            Wolf-Sheep: if wolf agent and sheep agent in same cell, the wolf
            eats sheep; sheep agent removed, wolf gains energy
          </li>
        </ul>

        <h2>Logic overview</h2>

        <ol>
          <li>
            For each dirt cell, determine if the cell has regrown to grass
          </li>
          <li>Move each agent and reduce the moving agent's energy</li>
          <li>
            If any cells contain both wolves and sheep, the wolves eat the sheep
            and gain energy
          </li>
          <li>
            If any grass cells contain sheep, the sheep eats the grass and gain
            energy and the cell becomes dirt
          </li>
          <li>
            For each agent,determine if the agent reproduces, and if it does,
            create the offspring agent
          </li>
          <li>If any agent has energy ≤0, the agent starves</li>
        </ol>
      </article>
    </section>
  )
}

export default About
