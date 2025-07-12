import { useNetworkData } from '@/app/lib/workstation/nivo/NivoNetworkFormat'
import { ResponsiveNetwork } from '@nivo/network'
import { useTheme } from 'next-themes';


export const EdgesGraphNetwork = () => {
    const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const axisColor = theme === "dark" ? "#9ca3af" : "#6b7280";
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const tooltipBackgroundColor = theme === "dark" ? "#374151" : "#ffffff";
  const tooltipTextColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const { nodes, links } = useNetworkData() // Your hook from earlier
const NodeTooltip = ({ node }: { node: any }) => {
    return (
      <div style={{
        background: tooltipBackgroundColor,
        padding: '8px 12px',
        borderRadius: '4px',
        color: tooltipTextColor,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        fontSize: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: node.color,
            marginRight: '8px',
            borderRadius: '50%'
          }} />
          <strong>{node.id}</strong>
        </div>
        <div>Centrality: {node.size.toFixed(2)}</div>
      </div>
    )
  }
  const networkData = {
    nodes: nodes.map(node => ({
      id: node.id,
      size: node.size,
      color: node.color,
      height: node.height,
      // Include any other node properties
    })),
    links: links.map(link => ({
      source: link.source,
      target: link.target,
      distance: link.distance,
      // Include any other link properties
    }))
  }

  return (
    <div style={{ height: '600px' }}>
      <ResponsiveNetwork
        data={networkData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={link => link.distance} // 'link' is each link object
        nodeSize={node => node.size} // 'node' is each node object
        activeNodeSize={node => 1.5 * node.size}
        nodeColor={node => node.color}
       
        linkBlendMode="multiply"
        theme={{
        axis: {
          domain: {
            line: {
              stroke: axisColor,
            },
          },
          ticks: {
            line: {
              stroke: axisColor,
            },
            text: {
              fill: textColor,
            },
          },
          legend: {
            text: {
              fill: textColor,
            },
          },
        },
        grid: {
          line: {
            stroke: gridColor,
            strokeWidth: 1,
          },
        },
        tooltip: {
          container: {
            background: tooltipBackgroundColor,
            color: tooltipTextColor,
            fontSize: 12,
            borderRadius: 4,
          },
          
        },
      }}
      nodeTooltip={NodeTooltip} 
      />
    </div>
  )
}