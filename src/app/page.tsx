"use client";
import React from "react";
import DynamicTable from "./components/DynamicTable";
import { useState } from "react";

export default function Home() {

  const [inputString, setInputString] = useState("");
  const [inputFrame, setInputFrame] = useState(0);
  const [selectedOption, setSelectedOption] = useState("1");

  function optimoReemplazo(opciones: string[], memoria: string[], indice: number): number {
    const pagina = opciones[indice];
    let maxDistancia = -1;
    let reemplazo = -1;

    for (let i = 0; i < memoria.length; i++) {
        const distancia = opciones.slice(indice + 1).indexOf(memoria[i]);
        if (distancia === -1) {
            return i; // No se usa más adelante, reemplazar directamente
        } else if (distancia > maxDistancia) {
            maxDistancia = distancia;
            reemplazo = i;
        }
    }
    return reemplazo;
}

function optimo(opciones: string[]): void {
    console.log("Ejecutando algoritmo óptimo...");
    const marcos = 3;
    let fallos = 0;
    const memoria: string[] = new Array(marcos).fill("-1");

    console.log("Memoria inicial: ", memoria);
    for (let i = 0; i < opciones.length; i++) {
        const pagina = opciones[i];
        if (!memoria.includes(pagina)) {
            fallos++;
            console.log(`Fallo de página al acceder a ${pagina}`);
            if (memoria.includes("-1")) {
                memoria[memoria.indexOf("-1")] = pagina;
            } else {
                const reemplazo = optimoReemplazo(opciones, memoria, i);
                memoria[reemplazo] = pagina;
            }
        } else {
            console.log(`Página ${pagina} ya está en memoria`);
        }
        console.log("Estado de la memoria: ", memoria);
    }
    console.log(`Total de fallos de página: ${fallos}`);
}

function fifo(opciones: string[]): void {
  console.log("Ejecutando algoritmo FIFO...");
  const marcos = 3;
  let fallos = 0;
  const memoria: string[] = new Array(marcos).fill("-1");
  let puntero = 0;

  console.log("Memoria inicial: ", memoria);

  for (let i = 0; i < opciones.length; i++) {
      const pagina = opciones[i];
      if (!memoria.includes(pagina)) {
          fallos++;
          console.log(`Fallo de página al acceder a ${pagina}`);
          memoria[puntero] = pagina;
          puntero = (puntero + 1) % marcos;
      } else {
          console.log(`Página ${pagina} ya está en memoria`);
      }
      console.log("Estado de la memoria: ", memoria);
  }

  console.log(`Total de fallos de página: ${fallos}`);
}

function lru(opciones: string[]): void {
  console.log("Ejecutando algoritmo LRU...");
  const marcos = 3;
  let fallos = 0;
  const memoria: string[] = new Array(marcos).fill("-1");
  const tiempos: number[] = new Array(marcos).fill(0);

  console.log("Memoria inicial: ", memoria);

  for (let i = 0; i < opciones.length; i++) {
      const pagina = opciones[i];
      if (!memoria.includes(pagina)) {
          fallos++;
          console.log(`Fallo de página al acceder a ${pagina}`);
          const reemplazo = tiempos.indexOf(Math.min(...tiempos));
          memoria[reemplazo] = pagina;
          tiempos[reemplazo] = i;
      } else {
          console.log(`Página ${pagina} ya está en memoria`);
          tiempos[memoria.indexOf(pagina)] = i;
      }
      console.log("Estado de la memoria: ", memoria);
  }

  console.log(`Total de fallos de página: ${fallos}`);
}

function fifoPlus(opciones: number[]): void {
  console.log("Ejecutando algoritmo FIFO+...");

  const marcos = 3;
  const VACIO = -1;
  let fallos = 0;
  const memoria: number[] = new Array(marcos).fill(VACIO);
  const lives: number[] = new Array(marcos).fill(0);
  const tiempos: number[] = new Array(marcos).fill(0);

  console.log("Memoria inicial:", memoria);

  for (let i = 0; i < opciones.length; i++) {
      const pagina = opciones[i];
      console.log(`\nAccediendo a la página ${pagina}...`);

      // Caso 1: página no está y hay espacio disponible
      if (!memoria.includes(pagina) && memoria.includes(VACIO)) {
          fallos++;
          console.log(`Fallo de página al acceder a ${pagina}`);
          const indiceLibre = memoria.indexOf(VACIO);
          memoria[indiceLibre] = pagina;
          tiempos[indiceLibre] = i;
          lives.fill(0);
          lives[indiceLibre] = 1;

      // Caso 2: página no está y no hay espacio → Reemplazo
      } else if (!memoria.includes(pagina)) {
          fallos++;
          console.log(`Fallo de página al acceder a ${pagina}`);

          // Ordenar por tiempo de llegada (FIFO)
          const indicesOrdenados = tiempos
              .map((t, idx) => ({ idx, tiempo: t }))
              .sort((a, b) => a.tiempo - b.tiempo);

          let reemplazo = indicesOrdenados.find(obj => lives[obj.idx] !== 1)?.idx;

          if (reemplazo === undefined) reemplazo = indicesOrdenados[0].idx;

          memoria[reemplazo] = pagina;
          tiempos[reemplazo] = i;
          lives.fill(0);
          lives[reemplazo] = 1;

      // Caso 3: página ya está en memoria
      } else {
          console.log(`Página ${pagina} ya está en memoria`);
          const index = memoria.indexOf(pagina);
          lives.fill(0);
          lives[index] = 1;
      }

      console.log("Estado de la memoria:", memoria);
  }

  console.log(`\nTotal de fallos de página: ${fallos}`);
}

  function menuAlgorithm(selectedOption: string) {
    switch (selectedOption) {
      case "OPTIMO":
        return "OPTIMO";
      case "FIFO":
        return "FIFO";
      case "LRU":
        return "LRU";
      case "FIFO+":
        return "FIFO+";
      default:
        return "Invalid option";
    }
  }
  
  const eventMouseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const inputString = document.getElementById("input-string") as HTMLInputElement;
    const inputFrame = document.getElementById("input-frame") as HTMLInputElement;
    const select = document.getElementById("replacement-select") as HTMLSelectElement;
    setInputString(inputString.value);
    setInputFrame(parseInt(inputFrame.value));
    setSelectedOption(select.value);
  };

  return (
    <main className="flex items-center justify-between p-24">
      <section className="flex flex-col items-center justify-center w-[50%] bg-[#272626] h-[70vh] gap-20">
        {/* Title */}
        <h1 className="text-2xl">REPLACEMENT ALGORITHMS</h1>

        <div className="flex flex-col gap-5">
          {/* Input string */}
          <div className="flex items-center justify-between gap-5">
            <label htmlFor="input-string">Input:</label>
            <input type="text" id="input-string" className="border-amber-50 border-1 p-1"/>
          </div>
          {/* Input Frame */}
          <div className="flex items-center justify-between gap-5">
            <label htmlFor="input-frame">Frame:</label>
            <input type="number" id="input-frame" min="0" className="border-amber-50 border-1 p-1"/>
          </div>
          {/* Options */}
          <div className="flex items-center justify-between gap-5">
            <label htmlFor="replacement-select">Choose an option:</label>
            <select id="replacement-select" name="replacement" className="cursor-pointer border-amber-50 border-1 p-1">
              <option value="OPTIMO" className="text-black">OPTIMO</option>
              <option value="FIFO" className="text-black">FIFO</option>
              <option value="LRU" className="text-black">LRU</option>
              <option value="FIFO+" className="text-black">FIFO+</option>
            </select>
          </div>
        </div>
        {/* Button Run */} 
        <button type="button" className="bg-[#4f46e5] text-white px-4 py-2 rounded-md mt-5 cursor-pointer hover:bg-[#4338ca] transition duration-200" onClick={(e: React.MouseEvent<HTMLButtonElement>) => eventMouseClick(e)}>
            Run
        </button>
      </section>
      {/* Dynamic Table */}
      <section className="flex flex-col items-center justify-center w-[50%] h-[70vh] bg-white text-black">
        <DynamicTable inputString={inputString} inputFrame={inputFrame}  selectedOption={selectedOption}/>
      </section>
    </main>
  );
}
