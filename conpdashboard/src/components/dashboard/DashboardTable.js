import React, {Component} from 'react'
import axios from 'axios';

export default class DashboardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Pipelines: []
        };
    }
    getPipelinesData() {
     
        axios
            .get(`http://localhost:8081/pipTable`, {})
            .then(res => {
                const data = res.data
                
                const pipelinestmp = data.pipelineTable.map(p =>
                  <tr>
                  <td><a href={"https://portal.conp.ca/pipeline?id="+p.pipelineDOI} target="_blank">  {p.pipeline}</a></td>
                <td>{p.Dataset}</td>
                <td>{p.exitcode} </td>

                  </tr>)
                 
                 this.setState({
                         Pipelines: pipelinestmp,
                     })

            })
            .catch((error) => {
                           console.log(error)
            })
       
    }
    componentDidMount(){
      const tmp=this.state.Pipelines;
      

        this.getPipelinesData()
    }
    
    render() {

        return (
            <div className="">
            <h4 className="center"></h4>
            <table className="responsive-table"  width="100%">
        <thead>
          <tr>

              <th>PipeLines</th>
              <th>Datasets</th>
              <th>Exit_Codes</th>
          </tr>
        </thead>

        <tbody>
          {this.state.Pipelines}
  
        </tbody>
      </table>
        </div>
        )
    }
}