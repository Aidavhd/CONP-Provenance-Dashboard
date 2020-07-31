import React, {Component} from 'react'
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

 class DashboardPipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
            series:[],
            options:{},
            
        };
    }
    
    getPipelinesData() {
        axios
            .get(`http://localhost:8081/chart`, {})
            .then(res => {
                const data = res.data
                    this.setState({
                        series: [{
                          name: 'Successfull Run',
                          data: data.pipinfo.map(p => p.success),
                        }, {
                          name: 'Unsuccessful Run',
                          data: data.pipinfo.map(p => p.fail),
                        }
                        ],
                        options: {
                          colors: ['#27c47d','#F44336'],
                          chart: {
                            type: 'bar',
                            height: 350,
                            stacked: true,
                            events: {
                              dataPointSelection: function(event, chartContext, config) {
                                console.log(chartContext, config);
                              }
                            }
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
                            text: ''
                          },
                          xaxis: {
                            categories:  data.pipinfo.map(p => p.pip
                            //<a href={"https://portal.conp.ca/pipeline?id="+p.pipline_info.DOI} target="_blank">  {p.pip}</a>
                            ),
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
                            opacity: 1,
                            colors: ['#27c47d','#F44336']
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
        )
    }
}


 const domContainer = document.querySelector('#app');
export default DashboardPipe;






