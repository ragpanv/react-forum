import  {   useState } from 'react';
import {auth,firestore, signOut} from '../firebase';
import {Link} from 'react-router-dom';

function Sidebar(props) {
    const { channels } = props;
    const [channelName, setChannelName] = useState('');
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelDesp, setNewChannelDesp] = useState('');

    function handleJoinChannel(e){
      setChannelName(e.target.value);
    }
    function handleNewChannelName(e) {
      setNewChannelName(e.target.value);
    }
    function handleNewChannelDesp(e) {
      setNewChannelDesp(e.target.value);
    }
    
    function myfun(){
      var x = document.getElementById("myDIV");
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    }
    
  function newch(e){
    console.log(newChannelName, newChannelDesp)
    const m=String(auth.currentUser.uid)
    var i=0
    firestore
      .collection('channels')
      .add({
        created_by: String(auth.currentUser.uid),
        description: newChannelDesp,
        members:[
          m,
        ],
        name : newChannelName
      }).then(()=>{
        console.log('channel added');
        window.location.reload(false);
      })
  }


  function exitch(e) {
    console.log("clled",e.name);
    firestore.collection('channels').where('name','==',e.name).get()
        .then((snapshot)=>{
          let mem;
        snapshot.docs.map((doc) => {
                mem=doc.data()['members']
                console.log(mem)
                var ind=mem.indexOf(String(auth.currentUser.uid),0)
                mem.splice(ind,1)        

          });
          firestore
            .collection('channels').doc(e.id)
            .update({ members: mem })
            .then(() => {
              console.log('exited channel')
              window.location.reload(false);
            });            
      });
  }

  function onEnterPress(e){
     var users=[], cid;
      if (e.keyCode === 13 && e.target.value) {
        e.preventDefault();
        
        console.log(e.target.value)
        const data = {
          id: auth.currentUser.uid,
        };

        firestore
          .collection('channels')
          .where('name','==',e.target.value)
          .get()
          .then((snapshot)=>{
            snapshot.docs.map((doc)=>{
              users=doc.data()['members']
            })
        })
        
        firestore.collection('channels').where('name','==',e.target.value).get()
        .then((snapshot)=>{
          snapshot.docs.map((doc) => {
            cid=doc.id
          });
          if(users.includes(data.id)){
            document.getElementById('check').innerHTML =
              '<h4>You are already member of this channel</h2>';
            document.getElementById('cname').value="";
            setTimeout(function () {document.getElementById('check').innerHTML =""},3000);            
          }else if (cid){
            firestore
              .collection('channels')
              .where('name', '==', e.target.value)
              .get()
              .then((snapshot) => {
                snapshot.docs.map((doc) => {
                  users = doc.data()['members'];
                  users.push(data.id);                
                });

                 firestore
                   .collection('channels')
                   .doc(cid)
                   .update({members: users} )
                   .then(() => {
                     window.location.reload(false);
                   });
                });                       
          }
            else{
              document.getElementById('check').innerHTML='<h4>No such channel exist</h4>';
              setTimeout(function () {document.getElementById('check').innerHTML = '';}, 3000);            
              document.getElementById('cname').value="";
            }  
        })
        
    }
}

     return (
       <div id="sidebar">
         <div className="user-profile">
           <div className="avatar">
             <img
               src="https://www.flaticon.com/svg/static/icons/svg/2919/2919600.svg"
               alt=""
             />
           </div>
           <div>Home</div>
           <div
             style={{ marginLeft: 10, marginTop: 2, cursor: 'pointer' }}
             onClick={signOut}
           >
             <img
               src="https://www.flaticon.com/svg/static/icons/svg/2150/2150480.svg"
               alt=""
               height="25"
             />
           </div>
         </div>
         <hr className="sidebar-spacer" />

         <div className="channels">
           <div className="header">Channels</div>

           <ul
             className="channels-list"
             style={{ marginLeft: 10, marginTop: 2 }}
           >
             {channels.map((channel) => (
               <li key={channel.id}>
                 <div>
                   <Link to={`/?id=${channel.id}`}># {channel.name}</Link>
                 </div>
               </li>
             ))}
           </ul>
         </div>
         <div>
           <input
             type="text"
             placeholder="search channel to join"
             onChange={handleJoinChannel}
             onKeyDown={onEnterPress}
             value={channelName}
             id="cname"
           />
           <div style={{ color: 'wheat' }} id="check"></div>
         </div>

         <div className="dropdown">
           <button className="dropbtn">Leave this Channel</button>
           <div className="dropdown-content">
             <ul className="channels-list">
               {channels.map((channel) => (
                 <li key={channel.id}>
                   <div>
                     {channel.name}
                     <span>
                       <button
                         onClick={() => exitch(channel)}
                         className="del-btn"
                       >
                         x
                       </button>
                     </span>
                   </div>
                 </li>
               ))}
             </ul>
           </div>
         </div>

         <div>
           <button onClick={myfun} className="dropbtn">
             Create a Channel
           </button>
           <div style={{ display: 'none' }} id="myDIV">
             <div className="form_style">
               <h4># CHANNEL</h4>
               <div className="field">
                 <label style={{ color: 'maroon', margin: '5px' }}>
                   Channel Name
                 </label>
                 <input
                   type="text"
                   placeholder="Channel Name..."
                   onChange={handleNewChannelName}
                   value={newChannelName}
                 />
               </div>
               <div className="field">
                 <label style={{ color: 'maroon', margin: '5px' }}>
                   Description of Channel
                 </label>
                 <input
                   type="text"
                   placeholder="Description..."
                   onChange={handleNewChannelDesp}
                   value={newChannelDesp}
                 />
               </div>
               <button
                 onClick={newch}
                 style={{
                   marginTop: '5px',
                   backgroundColor: 'wheat',
                   border: '2px solid black',
                   borderRadius: '5px',
                 }}
                 onClick={() => newch()}
               >
                 Create
               </button>
             </div>
           </div>
         </div>
       </div>
     );
}

export default Sidebar;
