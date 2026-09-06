"use client";

import Image from "next/image";
import { useState } from "react";
import { getAsset } from "@/data/sceneAssets";

// Generic layered scene-composition primitive. A "scene" is a stack of
// positioned layers over a fixed-aspect-ratio canvas — background,
// furniture, patient, nurse, equipment, monitors — plus optional
// interactive hotspots, matching the reference's background + furniture +
// patient + nurse + equipment + hotspot assembly model. Any future
// clinical scene should be built by composing this, not by hand-coding a
// new one-off layout.
//
// Hotspots are purely presentational (reveal a label on click) — they
// carry no XP/scoring logic of their own, so they can't interfere with
// the actual question-answering flow that drives progression.

export type SceneLayer =
  | { type: "asset"; assetId: string; x: number; y: number; widthPct: number; opacity?: number; frame?: boolean }
  | { type: "hotspot"; x: number; y: number; label: string; detail: string };

export function Scene({ layers, aspectRatio = "16 / 10" }: { layers: SceneLayer[]; aspectRatio?: string }) {
  return (
    <div className="scene" style={{ aspectRatio }}>
      {layers.map((layer, i) =>
        layer.type === "asset" ? (
          <AssetLayer key={i} layer={layer} />
        ) : (
          <Hotspot key={i} layer={layer} />
        )
      )}
    </div>
  );
}

function AssetLayer({ layer }: { layer: { assetId: string; x: number; y: number; widthPct: number; opacity?: number; frame?: boolean } }) {
  const asset = getAsset(layer.assetId);
  const style = { left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.widthPct}%`, opacity: layer.opacity ?? 1 };
  const framed = layer.frame ?? true;

  if (!asset.src) {
    return (
      <div className="scene-layer scene-pending" style={style}>
        <span>{asset.label}</span>
        <small>asset pending</small>
      </div>
    );
  }

  return (
    <div className={framed ? "scene-layer" : "scene-layer scene-layer-flat"} style={style}>
      <Image src={asset.src} alt={asset.label} width={asset.width} height={asset.height} unoptimized style={{ width: "100%", height: "auto" }} />
    </div>
  );
}

function Hotspot({ layer }: { layer: { x: number; y: number; label: string; detail: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="scene-hotspot" style={{ left: `${layer.x}%`, top: `${layer.y}%` }}>
      <button
        type="button"
        className={open ? "hotspot-marker open" : "hotspot-marker"}
        aria-expanded={open}
        aria-label={`Assess: ${layer.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        +
      </button>
      {open && (
        <div className="hotspot-detail" role="note">
          <b>{layer.label}</b>
          <p>{layer.detail}</p>
        </div>
      )}
    </div>
  );
}
