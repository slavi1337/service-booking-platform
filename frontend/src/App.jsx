import { useState, useEffect } from 'react';
import { getAvailableSlots } from './api'; 
import './App.css';

function App() {
  const [slots, setSlots] = useState([]); 
  const [selectedDate, setSelectedDate] = useState('2025-08-11'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAvailableSlots(selectedDate);
        setSlots(response.data); 
      } catch (err) {
        setError('Došlo je do greške pri učitavanju termina.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchSlots();
  }, [selectedDate]);

  return (
    <>
      <h1>Service Booking Platform</h1>
      
      <div>
        <label htmlFor="date-picker">Izaberi datum: </label>
        <input 
          type="date" 
          id="date-picker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <hr />

      <h2>Slobodni termini za {selectedDate}:</h2>
      {loading && <p>Učitavanje...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <ul>
        {slots.map((slot) => (
          <li key={slot.id}>
            {new Date(slot.slotTime).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
            <button style={{marginLeft: '10px'}}>Rezerviši</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;