import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';

interface MyData {
  salesperson: string;
  sales: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.barGraph();
  }

  barGraph() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 960 - margin.right - margin.left;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .range([height, 0]);

    const svg = d3.select('#bar-graph')
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.csv('assets/sales.csv', (err, data) => {
      if (err) { throw new Error('Something went wrong!'); }

      const myData: MyData[] = [];
      data.forEach((d: { string, number }) => {
        d['sales'] = +d['sales'];
        myData.push({ salesperson: d['salesperson'], sales: d['sales'] });
      });

      x.domain(data.map((d) => d['salesperson']));
      y.domain([0, d3.max(myData, (d) => d['sales'])]);

      svg.selectAll('.bar')
        .data(myData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.salesperson))
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(d.sales))
        .attr('height', (d) => height - y(d.sales));

      svg.append('g')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(d3.axisBottom(x));

      svg.append('g')
        .call(d3.axisLeft(y));
    });
  }
}
