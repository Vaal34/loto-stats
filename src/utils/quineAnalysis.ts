/**
 * Utility functions for analyzing Quine, Double Quine, and Carton Plein
 */

import { Manche } from "../types/game";

export interface QuineMilestone {
  type: "quine" | "deuxieme-quine" | "double-quine" | "carton-plein";
  numberDrawn: number; // At which number in the sequence (1-90)
  position: number; // Position in the drawing sequence (index)
}

export interface MancheQuineAnalysis {
  mancheId: string;
  mancheNumber: number;
  milestones: QuineMilestone[];
  firstQuine?: number;
  deuxiemeQuine?: number;
  doubleQuine?: number;
  cartonPlein?: number;
}

/**
 * Analyzes a manche for quine milestones
 * Uses manually recorded milestones from the Manche data.
 */
export function analyzeMancheQuines(manche: Manche): MancheQuineAnalysis {
  const milestones: QuineMilestone[] = [];
  let firstQuine: number | undefined;
  let deuxiemeQuine: number | undefined;
  let doubleQuine: number | undefined;
  let cartonPlein: number | undefined;

  // Use manually recorded milestone positions
  if (manche.quineAt && manche.quineAt <= manche.numbers.length) {
    firstQuine = manche.quineAt;
    milestones.push({
      type: "quine",
      numberDrawn: manche.numbers[manche.quineAt - 1] || 0,
      position: manche.quineAt,
    });
  }

  if (
    manche.deuxiemeQuineAt &&
    manche.deuxiemeQuineAt <= manche.numbers.length
  ) {
    deuxiemeQuine = manche.deuxiemeQuineAt;
    milestones.push({
      type: "deuxieme-quine",
      numberDrawn: manche.numbers[manche.deuxiemeQuineAt - 1] || 0,
      position: manche.deuxiemeQuineAt,
    });
  }

  if (manche.doubleQuineAt && manche.doubleQuineAt <= manche.numbers.length) {
    doubleQuine = manche.doubleQuineAt;
    milestones.push({
      type: "double-quine",
      numberDrawn: manche.numbers[manche.doubleQuineAt - 1] || 0,
      position: manche.doubleQuineAt,
    });
  }

  if (manche.cartonPleinAt && manche.cartonPleinAt <= manche.numbers.length) {
    cartonPlein = manche.cartonPleinAt;
    milestones.push({
      type: "carton-plein",
      numberDrawn: manche.numbers[manche.cartonPleinAt - 1] || 0,
      position: manche.cartonPleinAt,
    });
  }

  // Sort milestones by position
  milestones.sort((a, b) => a.position - b.position);

  return {
    mancheId: manche.id,
    mancheNumber: manche.mancheNumber,
    milestones,
    firstQuine,
    deuxiemeQuine,
    doubleQuine,
    cartonPlein,
  };
}

/**
 * Calculate average positions for quines across all manches
 * Uses manually recorded milestone positions
 */
export function calculateQuineStats(manches: Manche[]) {
  // Filter to only include completed manches
  const completedManches = manches.filter((m) => !m.isActive);

  // Extract manually recorded positions
  const quinePositions = completedManches
    .map((m) => m.quineAt)
    .filter((p): p is number => p !== undefined && p > 0);

  const deuxiemeQuinePositions = completedManches
    .map((m) => m.deuxiemeQuineAt)
    .filter((p): p is number => p !== undefined && p > 0);

  const doubleQuinePositions = completedManches
    .map((m) => m.doubleQuineAt)
    .filter((p): p is number => p !== undefined && p > 0);

  const cartonPleinPositions = completedManches
    .map((m) => m.cartonPleinAt)
    .filter((p): p is number => p !== undefined && p > 0);

  return {
    averageQuinePosition:
      quinePositions.length > 0
        ? quinePositions.reduce((a, b) => a + b, 0) / quinePositions.length
        : null,
    averageDeuxiemeQuinePosition:
      deuxiemeQuinePositions.length > 0
        ? deuxiemeQuinePositions.reduce((a, b) => a + b, 0) /
          deuxiemeQuinePositions.length
        : null,
    averageDoubleQuinePosition:
      doubleQuinePositions.length > 0
        ? doubleQuinePositions.reduce((a, b) => a + b, 0) /
          doubleQuinePositions.length
        : null,
    averageCartonPleinPosition:
      cartonPleinPositions.length > 0
        ? cartonPleinPositions.reduce((a, b) => a + b, 0) /
          cartonPleinPositions.length
        : null,
    totalQuines: quinePositions.length,
    totalDeuxiemeQuines: deuxiemeQuinePositions.length,
    totalDoubleQuines: doubleQuinePositions.length,
    totalCartonPleins: cartonPleinPositions.length,
    fastestQuine:
      quinePositions.length > 0 ? Math.min(...quinePositions) : null,
    slowestQuine:
      quinePositions.length > 0 ? Math.max(...quinePositions) : null,
    fastestDeuxiemeQuine:
      deuxiemeQuinePositions.length > 0
        ? Math.min(...deuxiemeQuinePositions)
        : null,
    slowestDeuxiemeQuine:
      deuxiemeQuinePositions.length > 0
        ? Math.max(...deuxiemeQuinePositions)
        : null,
    fastestDoubleQuine:
      doubleQuinePositions.length > 0
        ? Math.min(...doubleQuinePositions)
        : null,
    slowestDoubleQuine:
      doubleQuinePositions.length > 0
        ? Math.max(...doubleQuinePositions)
        : null,
    fastestCartonPlein:
      cartonPleinPositions.length > 0
        ? Math.min(...cartonPleinPositions)
        : null,
    slowestCartonPlein:
      cartonPleinPositions.length > 0
        ? Math.max(...cartonPleinPositions)
        : null,
  };
}

/**
 * Get formatted label for milestone type
 */
export function getMilestoneLabel(type: QuineMilestone["type"]): string {
  switch (type) {
    case "quine":
      return "Quine";
    case "deuxieme-quine":
      return "2ème Quine";
    case "double-quine":
      return "Double Quine";
    case "carton-plein":
      return "Carton Plein";
  }
}

/**
 * Get color class for milestone badge
 */
export function getMilestoneColor(type: QuineMilestone["type"]): string {
  switch (type) {
    case "quine":
      return "bg-blue-500 text-white";
    case "deuxieme-quine":
      return "bg-indigo-500 text-white";
    case "double-quine":
      return "bg-purple-500 text-white";
    case "carton-plein":
      return "bg-amber-500 text-white";
  }
}
