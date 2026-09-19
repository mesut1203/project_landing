import type { SceneContent, ScenePacing, SequenceConfig } from '../data/content'

export const clamp = (value: number, min = 0, max = 1): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min

export function frameUrl(config: SequenceConfig, index: number): string {
  const safeIndex = Math.round(clamp(index, 0, config.frameCount - 1))
  return `${config.basePath}${String(safeIndex).padStart(config.padding, '0')}.webp`
}

export function sceneAt(progress: number, scenes: SceneContent[], variant: 'desktop' | 'mobile'): number {
  const index = scenes.findIndex((scene) => clamp(progress) < scene[variant].end)
  return index < 0 ? scenes.length - 1 : index
}

export function sceneProgress(progress: number, pacing: ScenePacing): number {
  return clamp((clamp(progress) - pacing.start) / (pacing.end - pacing.start))
}

export function progressToFrame(progress: number, scenes: SceneContent[], config: SequenceConfig): number {
  const scene = scenes[sceneAt(progress, scenes, config.id)]
  const pacing = scene[config.id]
  const local = sceneProgress(progress, pacing)
  const moving = clamp((local - pacing.openingHold) / (1 - pacing.openingHold - pacing.finalHold))
  return Math.round(clamp(pacing.frameStart + moving * (pacing.frameEnd - pacing.frameStart), 0, config.frameCount - 1))
}

export function copyOpacity(progress: number, scene: ScenePacing, first: boolean, last: boolean): number {
  if (progress < scene.start || progress > scene.end) return 0
  const local = sceneProgress(progress, scene)
  const enter = first ? 1 : clamp(local / 0.14)
  const leave = last ? 1 : clamp((1 - local) / 0.16)
  return Math.min(enter, leave)
}
