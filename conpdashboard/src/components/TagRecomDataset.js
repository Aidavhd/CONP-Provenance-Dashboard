import React, {Component} from 'react'
import axios from 'axios';


export default class TagRecomDataset extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
            Pipelines: []
        };
    }
    getPipelinesData() {
     
        axios
            .get(`http://localhost:8081/TagRecomDataset`, {})
            .then(res => {
                const data = res.data
                console.log(data)
                const pipelinestmp = data.result_for_pipeline.map(p =>
                  <tr>
                  <td><a href={"https://portal.conp.ca/pipeline?id="+p.pipeline_information.DOI} target="_blank">  {p.pipeline_information.Name}</a></td>
                <td>{(p.recommended_datasets.map(s=> s+", "))}</td>

                  </tr>)
                  console.log(pipelinestmp)
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
            <h4 className="center">Tag-Based Dataset Recommendation</h4>
            <table className="responsive-table">
        <thead>
          <tr>

              <th>PipeLines</th>
              <th>Recommended Datasets List</th>
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
