import './App.css';
import React, { useState } from 'react';

function App() {

  //Contact list data structure
  const [contacts, setContact] = useState([
    {id: 1, name: "Khaleel", email: "khaleelanjum0@gmail.com"},
    {id: 2, name: "Test", email: "testUser@hotmail.com"},
    {id: 3, name: "SuperDau", email: "superEmail@test.com"},
    {id: 4, name: "asd", email: "fa@test.com"}
  ]);
  
  //useStates used inside various functions
  const [stage, setStage] = useState(0);
  const [newContact, setNewContact] = useState({});
  const [currentContact, setCurrentContact] = useState({});
  const [searchContact, setSearchContact] = useState({name: ""});
  const [selectFile, setSelectedFile] = useState();
  const [fileExists, setFileExists] = useState(false);

  //Handles form information when updating a contact's information
  const updateNewUser = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setNewContact(values => ({...values, [name]: value}))
  }

  //Adds a new user's contact information to the "contacts" list data structure
  const addUserToList = (contactName,contactEmail) => {
    const newID = contacts.length+1;
    const newUser = {id: newID, name: contactName, email: contactEmail};
    setContact(contacts => [...contacts, newUser])
  }

  //Handles parsing and formatting information for it to be added to the contacts list
  const addNewUser = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    addUserToList(name,email);
    alert("User " + name + " has been added!");
    setNewContact({});
  }

  //Handles information recovery from the user when adding a new contact
  function createContact() {
    return(
      <form onSubmit={addNewUser}>
        <h1>Create New Contact</h1>
        <label>Enter your name: 
        <input 
          type="text" 
          name="name" 
          value={newContact.name || ""} 
          onChange={updateNewUser}
        />
        </label>
        <br></br>
        <label>Enter your email: 
          <input 
            type="text" 
            name="email" 
            value={newContact.email || ""} 
            onChange={updateNewUser}
          />
          </label>
          <br></br>
          <input type="submit" />
      </form>
    )
  }

  //Accepts new information records and handles editing a contact's information currently present in the data structure
  //Returns user back to contact list after updating
  const editUser = (event) => {
    event.preventDefault();
    const idToChange = currentContact.id;
    const contactName = event.target.name.value;
    const contactEmail = event.target.email.value;
    setContact(currentList => currentList.map(
      contactEntry => {
        if(contactEntry.id === idToChange){
          return{
            ...contactEntry, name: contactName, email: contactEmail
          };
        }
        return contactEntry
      }
    ))
    alert(contactName + " has been updated!");
    setStage(0);
  }

  //Sets the window into editing mode and passes on the contact's information that needs to be edited
  const enableEditing = (contactID) => {
    setStage(2);
    const currentContact = contacts.find(contactInfo => {
      return contactInfo.id === contactID;
    })
    setCurrentContact(currentContact);
  }

  //Handles form information when updating a exisitng user's details
  const updateExisitngUser = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrentContact(values => ({...values, [name]: value}))
  }

  //Handles information recovery from the user when editing an existing contact
  function editContact(contactInfo) {
    return(
      <form onSubmit={editUser}>
        <label>Enter your name: 
        <input 
          type="text" 
          name="name" 
          value={currentContact.name} 
          onChange={updateExisitngUser}
        />
        </label>
        <br></br>
        <label>Enter your email: 
          <input 
            type="text" 
            name="email" 
            value={currentContact.email || ""} 
            onChange={updateExisitngUser}
          />
          </label>
          <br></br>
          <input type="submit" />
      </form>
    )
  }

  function deleteContact(id) {
    setContact(current =>
      current.filter(contact => {
        return contact.id !== id;
      }))
  }

  //Handles form information when searching for exisitng users
  const updateSearch = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSearchContact(values => ({...values, [name]:value}))
  }

  //Handles information recovery from the user when searching for exisitng users
  function searchForContact() {
    const updatedContacts = contacts.filter(contactInfo => contactInfo.name.includes(searchContact.name));
    return(
      <div>
        <h1>Search</h1>
        <label>Please enter a name:
          <input name="name" type="text" value={searchContact.name} onChange={updateSearch}></input>
        </label>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {updatedContacts.map(contact =>
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
      
    )
  }

  //Displays all existing contacts within the "contacts" data structure
  function displayContacts(contactList) {
    let count = 0;
    contactList.forEach(contactInfo => {
      contactInfo.id = count+=1;
    })
    return(
      <div>
        <h1>Contact List</h1>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {contactList.map(contact =>
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td><button onClick={() => deleteContact(contact.id)}>Delete</button></td>
                <td><button onClick={() => {enableEditing(contact.id); setStage(2)}}>Edit</button></td>
                
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  //Handles importing of new contacts
  //File import syntax:
  //name,email
  //name,email
  function contactListUpload() {
    const handleChange = (event) => {
      setSelectedFile(event.target.files[0]);
      setFileExists(true);
    };

    const parseFile = (event) => {
      event.preventDefault();
      
      let file = selectFile;
      const reader = new FileReader();
      let fileInfo = "";
      reader.onload = function(input) {
        fileInfo = input.target.result;
        const newContacts = fileInfo.split("\n");
        newContacts.forEach(element => {
          const contactDetails = element.split(",");
          addUserToList(contactDetails[0],contactDetails[1]);
          setStage(0);
        })
      }
      reader.readAsText(file)
      alert("Contacts have been successfully imported");
    };

    return(
      <div>
        <h1>Import Contacts</h1>
        {fileExists ? (
          <div>
            <p>Filename: {selectFile.name}</p>
          </div>
        ) : (
          <p>Please select a contact list.</p>
        )}
        <input type="file" name="file" onChange={handleChange}></input>
        <div>
          <button onClick={parseFile}>Submit</button>
        </div>
      </div>
    )
  }

  //Handles website structuring, window views and stage changes
  return (
    <div className="App">
      <header class="App-header">
        <h1>Phonebook</h1>
      </header>
      <div class="App-container">
        <div class="App-child-column">
          <div onClick={() => setStage(0)}>
            <p>Contacts</p>
          </div>
          <div onClick={() => setStage(1)}>
            <p>Add New Contact</p>
          </div>
          <div onClick={() => setStage(3)}>
            <p>Search</p>
          </div>
          <div onClick={() => setStage(4)}>
            <p>Import Contacts</p>
          </div>
        </div>
        <div class="App-child-contactBox">
        {stage === 0 && (
          displayContacts(contacts)
        )}
        {stage === 1 && (
          createContact(contacts)
        )}
        {stage === 2 && (
          editContact(currentContact)
        )}
        {stage === 3 && (
          searchForContact()
        )}
        {stage === 4 && (
          contactListUpload()
        )}
        </div>
      </div>
    </div>
  );
}

export default App;
