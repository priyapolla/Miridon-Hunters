import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "../components/Image";
import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Greeting from "../components/Greeting";
import Wins_Losses from "../components/Wins_Losses";
import API from "../utils/user/API";
import FormBtn from "../components/FormBtn";
import {Launcher} from '../components/Chat2';
import Menu  from '../components/Navbar/menus/pushRotate';
import Imagetwo from '../components/Imagetwo';
import Imagethree from '../components/Imagethree';
import { Well, Button, Jumbotron, Col } from 'react-bootstrap';
import Bio from '../components/Bio';

const Profile = props => (
  <div>

<div id="outer-container"> 
			<Menu 
				left 
				outerContainerId={"outer-container"} 
				pageWrapId={"page-wrap"}
                customBurgerIcon={ <Imagethree /> }  
			>
                <Imagethree />
				<a href="/">
					<Imagetwo />
				</a>
				<br />
				<a id="login" className="menu-item" href="/login">
					<h3>Log In</h3>
				</a>
				<a id="profile" className="menu-item" href="/profile">
					<h3>Profile</h3>
				</a>
				<a id="createhero" className="menu-item" href="/character_creation">
					<h3>Create Hero</h3>
				</a>
				<a id="selecthero" className="menu-item" href="/character_selection">
					<h3>Select Hero</h3>
				</a>
				<a id="battle" className="menu-item" href="/battle">
					<h3>Battle</h3>
				</a>
				<a id="upgrades" className="menu-item" href="/upgrades">
					<h3>Upgrades</h3>
				</a>
				<a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a>
			</Menu>

			<main id="page-wrap">

                <div className="container">
                < br />
                        {/* <Header user={props.user} /> */}
                        <Header user={props.user.user} />
                        <br />
                        <div className="jumbotron" height="2000px">	
                            {/* <h2> Bio </h2>
                                <Input
                                value={this.state.bio}
                                onChange={this.handleInputChange}
                                name="bio"
                                placeholder="Bio"
                                />		 */}
                <div className="row">
                <Col xs={6} md={6}>                            
                           {/* <Input/>
                            <FormBtn
                            onClick={this.handleFormSubmitBio}>
                            Update Bio
                            </FormBtn> */}
                            {
                                            props.user.user && 
                                            <Bio
                                                {...props}
                                            />
                                        }
                                        <h2> Image </h2>
                                        {props.user.user &&<Image 
                                            img={props.user.user.img}
                                        />}
                </Col>
                <Col xs={6} md={6}>
                            <Image/>
                </Col>
                </div>
                            <Wins_Losses/>
                            <p> </p>
                        </div>
                </div>
        
                <footer className="navbar-fixed-bottom">
                    <div className="container">
                        <div className="row">
                            <Col xs={2} md={3}>
                            <p>
                                <a href="/get-started">Get Started</a> 
                            </p>
                            </Col>
                            <Col xs={2} md={3}>
                            <p>
                                <a href="/about-us">About Us</a> 
                            </p>
                            </Col>
                            <Col xs={2} md={3}>
                            <p>
                                <a href="/support">Support</a> 
                            </p>
                            </Col>
                            <Col xs={2} md={3}>
                            <p>
                                <a href="/information">Information</a> 
                            </p>
                            </Col>
                        </div>
                    </div>
                </footer>

                <Launcher
                    agentProfile={{
                    teamName: 'react-live-chat',
                    imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
                    }}
                    onMessageWasSent={props._onMessageWasSent}
                    messageList={props.messageList}
                    showEmoji
                />
			</main>


		</div>
	</div>


    
   
);



  	


  export default Profile;
 

