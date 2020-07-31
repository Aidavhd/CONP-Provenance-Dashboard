import React from 'react'
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';


class DashboardDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        
        series:[],
        options:{},
        
    };
}

getPipelinesData() {

  axios
  .get(`http://localhost:8081/dataset`, {})
  .then(res => {
    const data = res.data
        this.setState({
            series: data.result,
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          title: {
          },
          xaxis: {
            categories:  data.pipelines.map(p => p),
            labels: {
              formatter: function (val) {
                return val
              }
            }
          },
          yaxis: {
            title: {
              text: undefined
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val
              }
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
          }
        },
      }
    )})
    .catch((error) => {
        console.log(error)
    })

}
componentDidMount(){

 this.getPipelinesData()

}
    render() {
      return (
        

  <div id="chart">
<ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
</div>
      );
    }
  }

  const domContainer = document.querySelector('#app');
  export default DashboardDataset;