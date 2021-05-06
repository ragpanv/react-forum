import React, {  useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {SignIn, Slack} from './';
import {UserContext} from '../Providers/UserProviders' 

const PrivateRoute=({component: Component, isLoggedIn, ...others})=>{
  return(
    <Route
    {...others}
    render={(props)=>{
      return isLoggedIn ? (
        <Component{...props}/>
      ):(
      <Redirect to={{
        pathname: '/login',
        state:{
          from: props.location,
        },
      }}/>
      );
    }}
    />
  );
};

function App(){
  const auth=useContext(UserContext);
  console.log('App -> auth',auth);

  if (auth.loading){
    return <h1>loading</h1>;
  }

  const loggedin = auth.user ? true:false;
    return (
      <div>
        <Switch>
          <Route exact path="/login" component={SignIn} />
          <Route exact path="/signup" component={SignIn} />
          <PrivateRoute exact path="/" component={Slack} isLoggedIn={loggedin} />
        </Switch>
      </div>
    );
}

export default App;
