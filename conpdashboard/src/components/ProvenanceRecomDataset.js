import React, {Component} from 'react'
import axios from 'axios';

export default class ProvenanceRecomDataset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Pipelines: []
        };
    }
    getPipelinesData() {
     
        axios
            .get(`http://localhost:8081/ProvRecPip`, {})
            .then(res => {
                const data = res.data
                
                const pipelinestmp = data.results_for_datasets.map(p =>
                  <tr>
                  <td> {p.dataset_name}</td>
                  <td>{(p.recommended_pipelines.map(s=> s+", "))}</td>

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
            <h4 className="center">Provenance-Based Pipeline Recommendation</h4>
            <table className="responsive-table">
        <thead>
          <tr>

              <th>Datasets</th>
              <th>Recomended Pipelines List</th>
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

