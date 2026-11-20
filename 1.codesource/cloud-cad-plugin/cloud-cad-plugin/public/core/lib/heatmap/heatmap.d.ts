declare module './heatmap.js' {
  
  interface HeatmapConfig {
    
    container?: Element | null
    
    radius?: number
    
    maxOpacity?: number
    
    minOpacity?: number
    
    blur?: number
    
    gradient?: Record<number, string>
    
    backgroundColor?: { r: number, g: number, b: number }
    
    opacity?: number
    
    width?: number
    
    height?: number
    
    max?: number
    
    min?: number
  }

  
  interface HeatmapData {
    
    x: number
    
    y: number
    
    value: number
    
    radius?: number
  }

  interface HeatmapInstance {
    setData(data: { max: number; data: HeatmapData[] }): void
    getDataURL(): string
    addData(data: HeatmapData | HeatmapData[]): void
    repaint(): void
  }

  const h337: {
    create(config: HeatmapConfig): HeatmapInstance
    register(pluginKey: string, plugin: unknown): void
  };

  export default h337;
}
