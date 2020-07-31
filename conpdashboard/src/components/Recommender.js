import React from 'react'
import ProvenanceRecomPip from './ProvenanceRecomPip'
import ProvenanceRecomDataset from './ProvenanceRecomDataset'
import TagRecomPip from './TagRecomPip'
import TagRecomDataset from './TagRecomDataset'
const Recommender = () => {
  return (
      <div className="container">
          <ProvenanceRecomPip />
         
          <hr></hr>
          <ProvenanceRecomDataset />
          
          <hr></hr>
          <TagRecomPip />
          
          <hr></hr>
          <TagRecomDataset />
          
      </div>
  )
}

export default Recommender
