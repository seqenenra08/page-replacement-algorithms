"use client";
import React from "react";
import DynamicTable from "./components/DynamicTable";
import { useState } from "react";

export default function Home() {

  const [inputString, setInputString] = useState("");
  const [inputFrame, setInputFrame] = useState(0);
  const [selectedOption, setSelectedOption] = useState("1");
  const [opcionesArray, setOpciones] = useState<string[][]>([]);
  const [fallos, setFallos] = useState(0);


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

  function fillArray(arrayA: string[][], value: string[]): string[][] {
      for (let i = 0; i < arrayA.length; i++) {
        arrayA[i].push(value[i]);
      }
      return arrayA;
  }

  function optimo(opciones: string[], marcos: number): void {
      console.log("Ejecutando algoritmo óptimo...");
      let fallos = 0;
      let opcionesArray2: string[][] = new Array(marcos).fill(null).map(() => []);
      const memoria: string[] = new Array(marcos).fill("");
      console.log("Opciones: ", opcionesArray2);

      console.log("Memoria inicial: ", memoria);
      for (let i = 0; i < opciones.length; i++) {
          const pagina = opciones[i];
          if (!memoria.includes(pagina)) {
              fallos++;
              console.log(`Fallo de página al acceder a ${pagina}`);
              if (memoria.includes("")) {
                  memoria[memoria.indexOf("")] = pagina;
              } else {
                  const reemplazo = optimoReemplazo(opciones, memoria, i);
                  memoria[reemplazo] = pagina;
              }
          } else {
              console.log(`Página ${pagina} ya está en memoria`);
          }
          console.log("Estado de la memoria: ", memoria);
          opcionesArray2 = fillArray(opcionesArray2, memoria);
      }
      console.log(`Total de fallos de página: ${fallos}`);
      console.log("Opciones: ", opcionesArray);
      setOpciones(opcionesArray2);
      setFallos(fallos);
  }

  function fifo(opciones: string[], marcos: number): void {
    console.log("Ejecutando algoritmo FIFO...");
    let fallos = 0;
    let opcionesArray2: string[][] = new Array(marcos).fill(null).map(() => []);
    const memoria: string[] = new Array(marcos).fill("");
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
        opcionesArray2 = fillArray(opcionesArray2, memoria);
    }
    setOpciones(opcionesArray2);
    console.log(`Total de fallos de página: ${fallos}`);
    setFallos(fallos);
  }

  function lru(opciones: string[], marcos: number): void {
    console.log("Ejecutando algoritmo LRU...");
    let fallos = 0;
    let opcionesArray2: string[][] = new Array(marcos).fill(null).map(() => []);
    const memoria: string[] = new Array(marcos).fill("");
    const tiempos: number[] = new Array(marcos).fill(0);

    console.log("Memoria inicial: ", memoria);

    for (let i = 0; i < opciones.length; i++) {
        const pagina = opciones[i];
        if (!memoria.includes(pagina)) {
            fallos++;
            console.log(`Fallo de página al acceder a ${pagina}`);
            const reemplazo = tiempos.indexOf(Math.min(...tiempos));
            memoria[reemplazo] = pagina;
            tiempos[reemplazo] = i+1;
        } else {
            console.log(`Página ${pagina} ya está en memoria`);
            tiempos[memoria.indexOf(pagina)] = i+1;
        }
        console.log("Estado de la memoria: ", memoria);
        opcionesArray2 = fillArray(opcionesArray2, memoria);
    }
    setOpciones(opcionesArray2);
    console.log(`Total de fallos de página: ${fallos}`);
    setFallos(fallos);
  }

  function fifoPlus(opciones: string[], marcos: number): void {
    console.log("Ejecutando algoritmo FIFO+...");
    const VACIO = "";
    let fallos = 0;
    const memoria: string[] = new Array(marcos).fill(VACIO);
    let opcionesArray2: string[][] = new Array(marcos).fill(null).map(() => []);
    const lives: number[] = new Array(marcos).fill(0);
    const tiempos: number[] = new Array(marcos).fill(0);

    console.log("Memoria inicial:", memoria);

    for (let i = 0; i < opciones.length; i++) {
        const pagina = opciones[i];
        console.log(`\nAccediendo a la página "${pagina}"...`);

        // Caso 1: página no está y hay espacio disponible
        if (!memoria.includes(pagina) && memoria.includes(VACIO)) {
            fallos++;
            console.log(`Fallo de página al acceder a "${pagina}"`);
            const indiceLibre = memoria.indexOf(VACIO);
            memoria[indiceLibre] = pagina;
            tiempos[indiceLibre] = i;
            lives.fill(0);
            lives[indiceLibre] = 1;

        // Caso 2: página no está y no hay espacio → Reemplazo
        } else if (!memoria.includes(pagina)) {
            fallos++;
            console.log(`Fallo de página al acceder a "${pagina}"`);

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
            console.log(`Página "${pagina}" ya está en memoria`);
            const index = memoria.indexOf(pagina);
            lives.fill(0);
            lives[index] = 1;
        }

        console.log("Estado de la memoria:", memoria);
        opcionesArray2 = fillArray(opcionesArray2, memoria);
    }
    setOpciones(opcionesArray2);
    console.log(`\nTotal de fallos de página: ${fallos}`);
    setFallos(fallos);  
  }

  function menuAlgorithm(selectedOption: string, opciones: string[], marcos: number) {
    switch (selectedOption) {
      case "OPTIMO":
        optimo(opciones, marcos);
        break;
      case "FIFO":
        fifo(opciones, marcos);
        break;
      case "LRU":
        lru(opciones, marcos);
        break;
      case "FIFO+":
        fifoPlus(opciones, marcos);
        break;
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
    menuAlgorithm(select.value, inputString.value.split(""), parseInt(inputFrame.value));
  };

  return (
    <main className="flex items-center justify-between p-24 max-md:flex-col max-md:p-5 max-sm:text-xs">
      <section className="flex flex-col items-center justify-center w-[50%] bg-[#272626] h-[70vh] gap-20 max-md:gap-5 max-lg:w-[40%] max-md:w-[80%] max-md:h-[50vh]">  
        {/* Title */}
        <h1 className="text-2xl max-lg:text-xl max-lg:mt-5 max-sm:text-center">REPLACEMENT ALGORITHMS</h1>

        <div className="flex flex-col gap-5 max-md:gap-2">
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
        <button type="button" className="bg-[#4f46e5] text-white px-4 py-2 rounded-md mt-5 max-lg:mt-0 cursor-pointer hover:bg-[#4338ca] transition duration-200" onClick={(e: React.MouseEvent<HTMLButtonElement>) => eventMouseClick(e)}>
            Run
        </button>
      </section>
      {/* Dynamic Table */}
      <section className="flex flex-col items-center justify-center w-[50%] h-[70vh] bg-white text-black max-lg:w-[60%] max-md:w-[80%] max-md:h-[50vh]">
        <DynamicTable inputString={inputString} inputFrame={inputFrame}  selectedOption={selectedOption} optionArray={opcionesArray}/>
        <h1 className="text-3xl mb-3">Fallos: {fallos}</h1>
      </section>
    </main>
  );
}
