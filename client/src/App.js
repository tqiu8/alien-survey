// /client/App.js
import React, { Component } from "react";
import {isMobile} from "react-device-detect";
import axios from "axios";
import "./App.css"

class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: 0,
    name: null,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    aliens: false,
    yes: false,
    no: false,
    answer: null,
    submit: false,
    final: false,
    R: null,
    fp: null,
    Ne: null, 
    fl: null,
    fi: null,
    fc: null,
    L: null,
    N: null,
    next: false,
    p1: false,
    p2: false
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
    if (this.state.next && isMobile){
      this.scrollToBottom();
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (name, yes, no, answer, R, fp, Ne, fl, fi, fc, L, N) => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    console.log(name, yes, no, answer)
    axios.post("/api/putData", {
      id: idToBeAdded,
      name: name,
      yes: yes,
      no: no,
      answer: answer,
      R: R,
      fp: fp,
      Ne: Ne,
      fl: fl,
      fi: fi,
      fc: fc,
      L: L,
      N: N
    });
  };


  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  enterName = (e) => {
    if (e.key == 'Enter'){
      this.setState({name: e.target.value, aliens:true});
    }
    
  }

  submitAnswer = (e) => {
    if (e.key == 'Enter') {
      console.log(e.target.value);
      this.setState({answer: e.target.value, submit: true});
    }
  }

  calculateDrake = (e) => {
    if (e.key == 'Enter') {
      this.setState({L: eval(e.target.value), R: eval(this.state.R), fp: eval(this.state.fp), 
                    Ne: eval(this.state.Ne), fl: eval(this.state.fl), fi: eval(this.state.fi),
                    fc: eval(this.state.fc)})
      var final = this.state.R * this.state.fp * this.state.Ne * this.state.fl * this.state.fi * this.state.fc * e.target.value * 10
      this.setState({N: final, final: true})
    }
  }

  submit = (name, yes, no, answer, R, fp, Ne, fl, fi, fc, L, N) => {
    this.putDataToDB(name, yes, no, answer, R, fp, Ne, fl, fi, fc, L, N)
    this.setState({next: true})
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  } 



  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data, N } = this.state;
    
    const questionsPage = (
      <div>
          <div className = "qa">
              <div className="element slow">
               <h1>where are they?</h1>
              </div>
              <div className="element slow">
                <h2>what is your name?</h2>
              </div>
              <div className="element slow">
                <input
                  className = "question"
                  type="text"
                  onKeyPress={e => this.enterName(e)}
                />
                <br/>
              </div>

              { this.state.aliens? 
                <div className="element box">
                  <h2>Do you believe in aliens?</h2>
                  <div className="buttons">
                    <button className="button" 
                    style= {{ float: "left" }}
                    onClick = { () => this.setState({yes: true}) } >
                    yes
                    </button>
                    <button className="button" style= {{ float: "right" }}
                        onClick = { () => this.setState({no: true}) }
                    > no </button>
                  </div>
                </div> 
              : null}

              <br/>
              { this.state.yes? 
                <div className="element box">
                  <h2>but why haven't we seen any of them yet?</h2>
                  <textarea 
                  className="long-answer"
                  onKeyPress={e => this.submitAnswer(e)}
                  >
                  </textarea>
                </div>
              : null}

              { this.state.no? 

                <div className="element box">
                  <h2>then do you believe we are all alone in the universe?</h2>
                  <textarea 
                    className="long-answer"
                    onKeyPress={e => this.submitAnswer(e)}
                    >
                    </textarea>
                </div>
              : null}

              {this.state.answer != null?
                <div className="right-element box">
                  <p>the Drake equation is a way for scientists to estimate the number of active alien civilizations in the milky way galaxy. the equation uses 
                  the main concepts which scientists must think about when considering the question of other life.</p>

                  {this.state.p1? null :
                    <button className="button"
                    onClick={() => this.setState({p1: true})} > next </button> }

                </div> 
              :null}

                {this.state.p1?
                  <div className='right-element'>
                    <div className="q box">
                      <h2>write your own version of the drake equation</h2>
                    </div>
                    <div className= "q box">
                      <p>instead, let us examine our own lives. compose a drake equation for the people in your life (estimate numbers that you're
                    unsure about)</p></div>
                
                      <div className='row'>
                        <input
                        className = "drake button button-column"
                        style= {{borderColor: "#dc4848"}}
                        type="text"
                        placeholder="10000"
                        onChange={e => this.setState({R: e.target.value})} 
                      />
                        <div className='text-column'>
                          the number of people you walk by, make eye contact with per year<br/>
                        </div></div>

                      <div className="row">
                        <input
                        className = "button drake button-column"
                        style= {{borderColor: "#faf15f"}}
                        type="text"
                        placeholder='0.00002'
                        onChange={e => this.setState({fp: e.target.value})}
                      /> 
                      <div className='text-column'>
                        the fraction of those people who would actually cross your mind<br/></div></div>

                      <div className="row">
                        <input
                        className = "button drake button-column"
                        style= {{borderColor: "#68d051"}}
                        type="text"
                        placeholder='0.002'
                        onChange={e => this.setState({Ne: e.target.value})}
                      /> 
                      <div className="text-column">
                        the fraction of the people who cross your mind with whom you would make contact<br/></div></div>

                      <div className="row">
                        <input
                        className = "button drake button-column"
                        style= {{borderColor: "#51d3e6"}}
                        type="text"
                        placeholder='0.001'
                        onChange={e => this.setState({fl: e.target.value})}
                      /> 
                      <div className="text-column">
                        the fraction of the people with whom you've made contact you actually like <br/>
                      </div></div>

                      <div className="row">
                        <input
                        className = "button drake button-column"
                        style = {{borderColor: "#3e47a8"}}
                        type="text"
                        placeholder='0.8'
                        onChange={e => this.setState({fi: e.target.value})}
                      />
                      <div className="text-column"> 
                        the fraction of the people you like who actually like you back<br/>
                      </div></div>

                      <div className="row">
                        <input
                        className = "button drake button-column"
                        style= {{borderColor: "#9242c9"}}
                        type="text"
                        placeholder='0.9'
                        onChange={e => this.setState({fc: e.target.value})}
                      />
                      <div className="text-column">
                        the fraction of the people who also like you back who are worth devoting your time to<br/>
                      </div></div>

                      <div className="row">
                        <input
                        className = "button drake button-column"
                        style= {{borderColor: "#c9258d"}}
                        type="text"
                        placeholder='60'
                        onKeyPress={e => this.calculateDrake(e)}
                        /> 
                      <div className="text-column">
                        how many years you hope your relationships last<br/></div></div>   
                    </div>
                  :null}                 


              {this.state.final? 
                <div className="element">
                  <h2>the number of people who will make an impact on your life is</h2>
                  <h2>{N}</h2>
                  <button className="button" onClick = {() => this.submit(this.state.name, this.state.yes, this.state.no, 
                                                                                this.state.answer, this.state.R, this.state.fp,
                                                                                this.state.Ne, this.state.fl, this.state.fi,
                                                                                this.state.fc, this.state.L, this.state.N)}>submit</button> 
                  </div>
                : null}

            
          </div>

          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
      </div>
      );

      const nextPage = (
        <div className="next">
          <div className="final">
            <h2>there are probably aliens out there. 
              <br /> or we could also be all alone, although sometimes we may feel that way regardless of their
              existence. 
              <br />but all we really know is that here we are: <br/> pale and imperfect stars in our own universe, colliding out of loneliness. 
              <br/>the sun is falling somewhere, and at the very end, from this seismic indecision <br/>arises what has been here all along. 
              </h2>
          </div>
          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>

      )
    return (this.state.next ? nextPage : questionsPage)
  }
}

export default App;