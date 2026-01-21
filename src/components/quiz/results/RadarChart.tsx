import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface PillarScore {
  name: string;
  score: number;
}

interface RadarChartProps {
  pillarScores: PillarScore[];
}

export const RadarChart = ({ pillarScores }: RadarChartProps) => {
  // Short labels for mobile
  const shortLabels: Record<string, string> = {
    Processos: "Processos",
    Pessoas: "Pessoas",
    Clientes: "Clientes",
    Controle: "Controle",
    Crescimento: "Crescimento",
  };

  const data = pillarScores.map((pillar) => ({
    subject: shortLabels[pillar.name] || pillar.name,
    value: pillar.score,
    fullMark: 100,
  }));

  return (
    <div className="w-full aspect-square max-w-[320px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.5}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ 
              fill: "hsl(var(--foreground))", 
              fontSize: 11,
              fontWeight: 500,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ 
              fill: "hsl(var(--muted-foreground))", 
              fontSize: 9 
            }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Pontuação"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
