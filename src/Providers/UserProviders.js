import React, {Component, createContext} from 'react';
import {auth, createOrGetUserProfileDocument} from '../firebase';


const initialUserState={user:null, loading: false};
export const UserContext= createContext(initialUserState);

class UserProviders extends Component{
    state=initialUserState;

  async componentDidMount(){
    //will be fired whenever you go from logged in to logged out state or vice versa state
      auth.onAuthStateChanged( async (userAuth) => {
          console.log("UserProvider -> componentDidMount -> userauth",userAuth);
          if(userAuth){
            const userRef = await createOrGetUserProfileDocument(userAuth);

          console.log('userRef ', userRef);
          
          userRef.onSnapshot((snapshot)=>{
            
            this.setState({
                user: {uid: snapshot.id, ...snapshot.data()},
                loading: false,
            });
          });
          this.setState({user:userAuth, loading:false});
        }
      });
  }

    render(){
      console.log(this.state.user);
        return (
          
          <UserContext.Provider value={this.state}>
            {this.props.children} {/*children are App component */}
          </UserContext.Provider>
        );
    }
}

export default UserProviders;