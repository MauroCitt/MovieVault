import { useState } from "react";
import styled from "styled-components";

export function Tabs() {
  const [activeTab, setactiveTab] = useState(0);
  const seleccionar = (index) => {
    setactiveTab(index);
  };
  return (
    <Container activeTab={`${activeTab}00%`}>
      <ul className="tabs">
        <li
          className={activeTab == 0 ? "active" : ""}
          onClick={() => seleccionar(0)}
        >
            <p className="mt-2 p-0">Netflix</p>
        </li>
        <li
          className={activeTab == 1 ? "active" : ""}
          onClick={() => seleccionar(1)}
        >
            Discover
        </li>
        <li
          className={activeTab == 2 ? "active" : ""}
          onClick={() => seleccionar(2)}
        >
           What we like
        </li>
        <span className="indicador"></span>
      </ul>
      <div className="tab-content">
        {activeTab === 0 && <h1>Tab 1</h1>}
        {activeTab === 1 && <h1>Tab 2</h1>}
        {activeTab === 2 && <h1>Tab 3</h1>}
      </div>
    </Container>
  );
}
const Container = styled.div`
position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding:20px;
  color:#0f0f0f;
  margin-top: 100px;
  .tabs{
    list-style: none;
    display: flex;
    box-shadow: 0px 10px 20px -3px rgba(0, 0, 0, 0.1);
    background-color: #202020;
    position: relative;
    border-radius: 100px;
    justify-content: space-between;
    top: 0;
    left: 0;
    color: #fff;
    
    li{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 54px;
      width: 150px;
      font-size: 1.25rem;
      font-weight: 500;
      cursor: pointer;
      z-index: 2;
      
    }
    .indicador {
      position: absolute;
      display: flex;
      height: 54px;
      width: 150px;
      background-color: #7425CF;
      z-index: 1;
      border-radius: 99px;
      transition: 0.25s ease-out;
      box-shadow: 0px 10px 20px -3px #7425CF;
      transform: translateX(${(props) => props.activeTab});
    }
  }
  .tab-content {
    position: relative;
    border-radius: 6px;
    margin-top: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items:center;
    font-size:3rem;
  }`

  export default Tabs
