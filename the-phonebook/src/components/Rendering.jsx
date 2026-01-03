const People = ({ people , removePerson }) => {
    return (
        <div>
           {people.map(person => (
            <div key={person.id}>
                {person.name} {person.number}
                <button onClick={() => removePerson(person.id, person.name)}>Delete</button>
                </div>
           ))}
        </div>
    )
}

export default People