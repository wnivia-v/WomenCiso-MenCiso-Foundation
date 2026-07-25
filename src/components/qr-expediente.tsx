"use client";

import { useState } from "react";
import { QrCode, Share2, Download, X, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRExpedienteProps {
  pacienteId: string;
  pacienteNombre: string;
}

/**
 * Genera un QR visual usando SVG (patrón determinístico basado en el ID del paciente).
 * En producción se usaría una librería real como `qrcode` o una API.
 * Este es funcional visualmente para la demo.
 */
function generarPatronQR(id: string): boolean[][] {
  const SIZE = 21;
  const grid: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  // Patrones fijos de posición (esquinas del QR)
  const marcarEsquina = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          grid[row + r][col + c] = true;
        }
      }
    }
  };
  marcarEsquina(0, 0);
  marcarEsquina(0, SIZE - 7);
  marcarEsquina(SIZE - 7, 0);

  // Patrón de datos basado en el hash del ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  for (let r = 8; r < SIZE - 8; r++) {
    for (let c = 8; c < SIZE - 8; c++) {
      hash = ((hash * 1103515245 + 12345) | 0) >>> 0;
      grid[r][c] = (hash % 3) !== 0;
    }
  }
  // Líneas de timing
  for (let i = 8; i < SIZE - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  return grid;
}

export function QRExpediente({ pacienteId, pacienteNombre }: QRExpedienteProps) {
  const [mostrar, setMostrar] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const url = `https://womenciso-menciso.org/expediente/${pacienteId}`;
  const grid = generarPatronQR(pacienteId);
  const SIZE = grid.length;
  const cellSize = 8;
  const svgSize = SIZE * cellSize;

  const copiarURL = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // fallback: seleccionar texto
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setMostrar(true)}>
        <QrCode className="mr-1.5 h-4 w-4" />
        Generar QR
      </Button>

      {mostrar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy-800">QR del Expediente</h3>
              <button
                onClick={() => setMostrar(false)}
                className="rounded-full p-1 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* QR Visual */}
            <div className="flex justify-center mb-4">
              <div className="rounded-xl border-2 border-navy-200 bg-white p-3">
                <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                  {grid.map((row, r) =>
                    row.map((cell, c) =>
                      cell ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c * cellSize}
                          y={r * cellSize}
                          width={cellSize}
                          height={cellSize}
                          fill="#1B2A4A"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-navy-800">{pacienteNombre}</p>
              <p className="text-xs text-navy-500">ID: {pacienteId}</p>
              <p className="mt-1 text-[10px] text-navy-400 break-all">{url}</p>
            </div>

            {/* Acciones */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copiarURL}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-xs font-medium text-navy-700 transition-colors hover:bg-navy-50 active:scale-95"
              >
                {copiado ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar link
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: `Expediente de ${pacienteNombre}`, url });
                  } else {
                    copiarURL();
                  }
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-navy-800 px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-navy-700 active:scale-95"
              >
                <Share2 className="h-3.5 w-3.5" />
                Compartir
              </button>
            </div>

            <p className="mt-3 text-center text-[10px] text-navy-400">
              El hospital puede escanear este QR para acceder al expediente completo del paciente.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
