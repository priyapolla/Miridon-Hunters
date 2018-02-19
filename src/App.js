import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Battle from "./pages/Battle";
import Character_Creation from "./pages/Character_Creation";
import Character_Selection from "./pages/Character_Selection";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Upgrade_and_Shop from "./pages/Upgrade_and_Shop";
import Greeting from "./components/Greeting";
import Wins_Losses from "./components/Wins_Losses";
import Chat from "./components/Chat";
import Column from "./components/Column";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Image from "./components/Image";
import Input from "./components/Input";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Profile_Main from "./components/Profile_Main";
import Row from "./components/Row";
import Store_Exchange from "./components/Store_Exchange";
import LoginForm from "./components/LoginForm";
import DisplayLinks from "./components/DisplayLinks";


const App = () =>
  <Router>
    <div>
      <Navbar/>
      <Wrapper>
        <Route exact path="/" component={Home} />
        <Route exact path="/Home" component={Home} />
        <Route exact path="/Battle" component={Battle} />
        <Route exact path="/Character_Creation" component={Character_Creation} />
        <Route exact path="/Character_Selection" component={Character_Selection} />
        <Route exact path="/Character_Creation" component={Character_Creation} />
        <Route exact path="/Profile" component={Profile} />
        <Route exact path="/Upgrade_and_Shop" component={Upgrade_and_Shop} />
        <Route exact path="/signup" component={SignupForm} />
        <Route exact path="/" render={() => <Home user={this.state.user} />} />
        <Route
          exact
          path="/login"
          render={() =>
            <LoginForm
              _login={this._login}
              _googleSignin={this._googleSignin}
            />}
        />
      </Wrapper>
      <Footer />
    </div>
  </Router>;

export default App;