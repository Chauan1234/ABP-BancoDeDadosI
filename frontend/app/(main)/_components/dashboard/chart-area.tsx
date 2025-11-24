"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "Overview of production metrics";

const chartConfig = {
    produtos: { label: "Produtos", color: "var(--chart-1)" },
    fabricacoes: { label: "Fabricações", color: "var(--chart-2)" },
} satisfies ChartConfig;

type DataPoint = {
    date: string;
    produtos: number;
    fabricacoes: number;
};

export function ChartAreaInteractive() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState("7d");
    const [dataPoints, setDataPoints] = React.useState<DataPoint[]>([]);

    React.useEffect(() => {
        if (isMobile) setTimeRange("7d");
    }, [isMobile]);

    React.useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
                const [resProd, resFab] = await Promise.all([fetch(`${baseUrl}/produtos`), fetch(`${baseUrl}/fabricacoes`)]);
                const prods = resProd.ok ? await resProd.json() : [];
                const fabs = resFab.ok ? await resFab.json() : [];
                const totalProd = (prods || []).length;
                const totalFab = (fabs || []).length;

                const points = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
                const arr: DataPoint[] = [];
                const today = new Date();
                for (let i = points - 1; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    const label = d.toISOString().slice(0, 10);
                    const prodVal = Math.round((totalProd / points) * (points - i));
                    const fabVal = Math.round((totalFab / points) * (points - i));
                    arr.push({ date: label, produtos: prodVal, fabricacoes: fabVal });
                }

                if (mounted) setDataPoints(arr);
            } catch {
                console.log("Erro ao carregar dados do gráfico");
            }
        }
        load();
        return () => { mounted = false; };
    }, [timeRange]);

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Resumo do Sistema</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">Visão rápida dos principais contadores</span>
                    <span className="@[540px]/card:hidden">Resumo</span>
                </CardDescription>
                <CardAction>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="flex w-40" size="sm" aria-label="Select a value">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d">Últimos 90 dias</SelectItem>
                            <SelectItem value="30d">Últimos 30 dias</SelectItem>
                            <SelectItem value="7d">Últimos 7 dias</SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={dataPoints}>
                        <defs>
                            <linearGradient id="fillProdutos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.08} />
                            </linearGradient>
                            <linearGradient id="fillFabricacoes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.08} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={20} tickFormatter={(value) => {
                            const d = new Date(value);
                            return d.toLocaleDateString();
                        }} />
                        <ChartTooltip cursor={false} defaultIndex={-1} content={<ChartTooltipContent indicator="dot" />} />
                        <Area dataKey="fabricacoes" type="natural" fill="url(#fillFabricacoes)" stroke="var(--color-fabricacoes)" stackId="a" />
                        <Area dataKey="produtos" type="natural" fill="url(#fillProdutos)" stroke="var(--color-produtos)" stackId="a" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}