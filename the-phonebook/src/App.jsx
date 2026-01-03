import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import AddPerson from './components/AddingPeople'
import People from './components/Rendering'
import personDatas from './services/datas'
import Warning from './components/Warning'
import './index.css'


const App = () => {
const [people, setPeople] = useState([]) 
const [newName, setNewName] = useState('')
const [newNumber, setNewNumber] = useState('')
const [filterNames, setNewFilter] = useState('')
const [warning, setWarning] = useState(null)
const [failWarning, setFailWarning] = useState(null)

useEffect(() => {
  personDatas.getAll().then(firstPeople => {
    console.log('First people: ', firstPeople)
    setPeople(firstPeople)
  })
}, [])

const handleNameChange = (event) => {
  console.log('Typing name.. : ', event.target.value)
  setNewName(event.target.value)
}

const handleNumberChange = (event) => {
  console.log('Typing number.. :', event.target.value)
  setNewNumber(event.target.value)
}

const handleFilterChange = (event) => {
  console.log('Typing in filter.. :', event.target.value)
  setNewFilter(event.target.value)
}


const addPerson = (event) => {
    event.preventDefault()

    const personExists = people.find(p => p.name.toLowerCase() === newName.toLowerCase());

    if(personExists) {
      console.log("Person found:", personExists);
      console.log("Person ID:", personExists.id);

      const verifyUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    
      if(verifyUpdate) {

        const updatedPerson = {...personExists, number: newNumber}

        personDatas.upgrade(personExists.id, updatedPerson)
          .then(upgraded => {
          setPeople(people.map(p => p.id !== personExists.id ? p : upgraded))
          setNewName('')
          setNewNumber('')
          console.log("Updating person:", personExists);
          setWarning(`Updated ${newName}'s number`)
          setTimeout(() => setWarning(null), 4000)
        }) 
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setFailWarning(`${newName} was already removed from server`)
            setTimeout(() => setFailWarning(null), 4000)
            setPeople(people.filter(p => p.id !== personExists.id))
          }else if (error.response && error.response.data && error.response.data.error) {
            setFailWarning(error.response.data.error)
            setTimeout(() => setFailWarning(null), 4000)
          } else {
            setFailWarning(`Failed to update ${newName}. Please try again later.`)
            setTimeout(() => setFailWarning(null), 4000)
            console.error("Error details:", error)
          }
        })
      } 
     } else {

      const newPerson = {name: newName, number: newNumber}

      personDatas
        .create(newPerson)
        .then(returnedPerson => {
        setPeople(people.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        console.log('Added: ', newName, newNumber)
        setWarning(`Added: ${newName}`)
        setTimeout(() => setWarning(null), 4000)
      })
      .catch(error => {
        console.error("Error creating person:", error.response.data.error)
        setFailWarning(error.response.data.error)
        setTimeout(() => setFailWarning(null), 4000)
      })
    }}

  const displayPeople = filterNames ? people.filter(person => person.name.toLowerCase().includes(filterNames.toLowerCase())) : people
  console.log('Filtered: ', displayPeople)

  const removePerson = (id, newName) => {
    if (window.confirm(`Delete ${newName}?`)) {
      personDatas.earse(id)
      .then(() => {
        setPeople(people.filter(person => person.id !== id && person._id !== id))
        setWarning(`Deleted: ${newName}`)
        setTimeout(() => setWarning(null), 4000)
      })
      .catch(error => {
        setFailWarning(`${newName} has already deleted`)
        setTimeout(() => setFailWarning(null), 4000)
        setPeople(people.filter(person => person.id !== id && person._id !== id))
      })
    }
  }

  return (
    <div>

      <h1>Phonebook</h1>

      <Warning message={warning} type="warning"/>
      <Warning message={failWarning} type="fail"/>

      <Filter value={filterNames} onChange={handleFilterChange} />
      

      <h2>add a new</h2>
      <AddPerson
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <People people = {displayPeople} removePerson={removePerson}/>
    </div>
  )
}

export default App