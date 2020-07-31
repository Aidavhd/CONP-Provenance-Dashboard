import React from 'react'
import DashboardPipe from './dashboard/DashboardPipe'
import DashboardDataset from './dashboard/DashboardDataset'
import DashboardTable from './dashboard/DashboardTable'

const Dashboard = () => {
    return (
        <div className="container">
            {/* <h4 className="center">Dashboard</h4> */}
            <h5 className="center">Overview</h5>
            <DashboardPipe />
            <h5 className="center">DataSet</h5>
            <DashboardDataset />
            <h5 className="center">Run Summary</h5>
            <DashboardTable />
            
            
        </div>
    )
}

export default Dashboard