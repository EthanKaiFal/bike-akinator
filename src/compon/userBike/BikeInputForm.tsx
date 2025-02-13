
import React from 'react'
import { createBike } from '../.././app/_actions/actions';
import "./inputForm.css";
export default async function BikeInputForm() {
  console.log("inside the bike input form")
  return (
    <div className="form-container">
      <form action={createBike} className='input-form'>
        <div className="form-group">
          <label>What number bike is this?</label>
          <input
            type="number"
            name="bikeNumber"
            id="bikeNumber"
            placeholder="Type in your bike number"
            className='form-input'
          />
        </div>
        <div className="form-group">
          <label>Brand:</label>
          <input
            type="text"
            name="bikeBrand"
            id="bikeBrand"
            placeholder="Type in your bike brand"
            className='form-input'
          />
        </div>
        <div className="form-group">
          <label>Model:</label>
          <input
            type="text"
            name="bikeModel"
            id="bikeModel"
            placeholder="Type in your bike model"
            className='form-input'
          />
        </div>
        <div className="form-group">
          <label>Year:</label>
          <input
            type="number"
            name="bikeYear"
            id="bikeYear"
            placeholder="Type in your bike year"
            className='form-input'
          />
        </div>
        <div className="form-group">
          <label>Is this bike already sold?</label>
          <select name="bikeSold" defaultValue="" className='form-input'>
            <option value="" disabled>Select...</option> {/* Placeholder */}
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Has this bike ever had engine issues?</label>
          <select name="bikeBroken" defaultValue="" className='form-input'>
            <option value="" disabled>Select...</option> {/* Placeholder */}
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group">
          <label>Roughly how many months have you owned this bike?</label>
          <input
            type="number"
            name="monthsOwned"
            id="monthsOwned"
            step="1"
            placeholder="0"
            className='form-input'
          />
        </div>
        <div className="form-group">
          <label>From 1-10 how would rate your experience with this bike? Decimals like 8.8 are usable.</label>
          <input
            type="number"
            name="bikeScore"
            id="handleBikeScore"
            min="0.0"
            max="10.0"
            step="0.1"
            placeholder="0.0"
            className='form-input'
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  )
}
