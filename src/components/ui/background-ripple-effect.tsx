"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DivGridProps {
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
  className?: string;
}

const DivGrid: React.FC<DivGridProps> = ({
  rows,
  cols,
  cellSize,
  borderColor,
  fillColor,
  clickedCell,
  onCellClick,
  interactive = false,
  className,
}) => {
  const [rippleCells, setRippleCells] = useState<Map<string, number>>(new Map());
  const animationRef = useRef<number | null>(null);
  const [rippleKey, setRippleKey] = useState(0);

  const triggerRipple = useCallback(
    (centerRow: number, centerCol: number) => {
      const maxDistance = Math.max(rows, cols);
      const newRippleCells = new Map<string, number>();

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const distance = Math.sqrt(
            Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
          );
          if (distance <= maxDistance) {
            const delay = distance * 40;
            newRippleCells.set(`${row}-${col}`, delay);
          }
        }
      }

      setRippleKey(prev => prev + 1);
      setRippleCells(newRippleCells);

      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }

      animationRef.current = window.setTimeout(() => {
        setRippleCells(new Map());
      }, maxDistance * 40 + 500);
    },
    [rows, cols]
  );

  useEffect(() => {
    if (clickedCell) {
      triggerRipple(clickedCell.row, clickedCell.col);
    }
  }, [clickedCell, triggerRipple]);

  const handleCellClick = (row: number, col: number) => {
    if (interactive) {
      triggerRipple(row, col);
      if (onCellClick) {
        onCellClick(row, col);
      }
    }
  };

  const handleCellHover = (row: number, col: number) => {
    if (interactive) {
      triggerRipple(row, col);
    }
  };

  return (
    <div
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const cellKey = `${row}-${col}`;
        const delay = rippleCells.get(cellKey);
        const isRippling = delay !== undefined;

        return (
          <div
            key={`${cellKey}-${rippleKey}`}
            className={cn(
              "cell-box",
              interactive && "cursor-pointer"
            )}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: isRippling ? undefined : fillColor,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: borderColor,
              animation: isRippling
                ? `cell-ripple 500ms ease-out ${delay}ms forwards`
                : undefined,
            }}
            onClick={() => handleCellClick(row, col)}
            onMouseEnter={() => handleCellHover(row, col)}
          />
        );
      })}
    </div>
  );
};

interface BackgroundRippleEffectProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}

export const BackgroundRippleEffect: React.FC<BackgroundRippleEffectProps> = ({
  rows = 12,
  cols = 32,
  cellSize = 48,
  className,
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ rows, cols });

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const newCols = Math.ceil(width / cellSize) + 2;
        const newRows = Math.ceil(height / cellSize) + 2;
        setDimensions({ rows: newRows, cols: newCols });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [cellSize]);

  const handleCellClick = (row: number, col: number) => {
    setClickedCell({ row, col });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden",
        className
      )}
    >
      <DivGrid
        rows={dimensions.rows}
        cols={dimensions.cols}
        cellSize={cellSize}
        borderColor="rgba(148, 163, 184, 0.12)"
        fillColor="transparent"
        clickedCell={clickedCell}
        onCellClick={handleCellClick}
        interactive={true}
        className="absolute -top-4 -left-4"
      />
    </div>
  );
};

export default BackgroundRippleEffect;
