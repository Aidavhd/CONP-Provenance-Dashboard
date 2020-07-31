import React, {useEffect, useRef } from "react";
import { select, scaleBand, axisBottom, stack, max, scaleLinear, axisLeft, stackOrderAscending } from "d3";
import useResizeObserver from "./useResizeObserver"

function StackedBarChartPipeline({ data, keys, colors }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        const svg = select(svgRef.current);
        const { width, height } =
            dimensions || wrapperRef.current.getBoundingClientRect();

        const stackGenerator = stack().keys(keys).order(stackOrderAscending);
        const layers = stackGenerator(data);
        const extent = [0, max(layers, layer => max(layer, sequence => sequence[1]))];
        
        //sclaes
        const xScale = scaleBand().domain(data.map(d => d.pipe))
                        .range([0, width]).padding(0.25);
        
        const yScale = scaleLinear().domain(extent).range([height, 0]);
        
        //rendering
        svg
            .selectAll(".layer")
            .data(layers)
            .join("g")
            .attr("class", "layer")
            .attr("fill", layer => {
                return colors[layer.key];
            })
            .selectAll("rect")
            .data(layer => layer)
            .join("rect")
            .attr("x", sequence => {
                return xScale(sequence.data.pipe);
            })
            .attr("width", xScale.bandwidth())
            .attr("y", sequence => yScale(sequence[1]))
            .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]));

        const xAxis = axisBottom(xScale);
        svg
            .select(".x-axis")
            .attr("transform", 'translate(0, ${height})')
            .call(xAxis);
        
        const yAxis = axisLeft(yScale);
        svg.select(".y-axis").call(yAxis);
    }, [colors, data, dimensions, keys]);

    return (
        <React.Fragment>
            <div ref={wrapperRef} style={{ marginBottom: "2rem "}}>
                <svg ref={svgRef}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                </svg>
            </div>
        </React.Fragment>
    );
}

export default StackedBarChartPipeline;