import React from 'react';
import { useLocalObservable, useObserver } from 'mobx-react';
import { useState } from 'react';
import './App.css';

function App() {

  const StoreContext = React.createContext();
  const [vatInfo, setVatInfo] = useState({
    address: "",
    countryCode: "",
    name: "",
    vatNumber: ""
  });
  const [message, setMessage] = useState(null)

  async function fetchVies(code) {
    const vat = code;
        if (code === '')
    {
      setMessage('Please enter code')
      }
    const vatResult = await fetch(`http://localhost:3001/checkVat/${vat}`);
    const vatData = await vatResult.json();
    setVatInfo(vatData);
    
    if (vatData.address === '---') {
      setMessage('Code not valid')
    }
    else {
      setMessage('')
    }
  }

 

  const StoreProvider = ({ children }) => {
    const store = useLocalObservable(() => ({
      data: vatInfo,
      addInfo: (info) => {
        store.data = info;
      },
    }));
  
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  };

  const Form = () => {
    const store = React.useContext(StoreContext);
    
    function handleSubmit(event)
    {
      setMessage('Please wait...')
      event.preventDefault();
      fetchVies(event.target[0].value)

      store.addInfo(vatInfo);
    }

    
  
    return (
      <div>
      
        <form onSubmit={(event) => handleSubmit(event)}>
          Enter VAT number (VIES) here:
          <div>
        <input type="text" />
        <button type="submit">
      Autofill
            </button>
            </div>
        
        </form>
        {message}
        </div>
    )
  }



  const InfoList = () => {
    const store = React.useContext(StoreContext);
  
    return useObserver(() => (
      <div>
      <ul>
      <li>Name <input type="text" defaultValue={store.data.name}></input></li>
          <li>Address <input type="text" defaultValue={store.data.address}></input></li>
        <li>Country <input type="text" defaultValue={store.data.countryCode}></input></li>
          <li>VAT Number <input type="text" defaultValue={store.data.vatNumber}></input></li>
          <button>Submit</button>
      </ul>
      </div>
    ))
  };

  return (
    <StoreProvider>
      <Form />
      <InfoList />
      </StoreProvider>
  );
}

export default App;
