
import './App.css';
import Tableau from "./Tableau";

 function App() {


  return (
  <div className="App">
    <div className="header">
       <nav>
        <ul className="menus">
          <li className="menu-items" >
              <a href="/">Menu</a>
          </li>
        </ul>
      </nav>
    </div>
    <div className="content">
      <Tableau/>
    </div>
  </div>
  );
}

export default App;
