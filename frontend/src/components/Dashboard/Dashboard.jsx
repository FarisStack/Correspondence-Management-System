// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
// --------- Components
import Widget from "./Widget";
import Featured from "./Featured";
import Chart from "./Chart";
// import Table from "../../components/table/Table";

const Dashboard = () => {
  return (
    <div className="home">
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Workflow)" aspect={2 / 1} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
