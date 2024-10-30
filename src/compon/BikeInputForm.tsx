import React from 'react'
import { createBike } from '.././app/_actions/actions';
const AddPost = () => {
    return (
        <form action={createBike} className='p-4 flex flex-col items-center gap-4'>
            <div className="inputField">
            <p>What number bike is this?</p>
            <input
              type="number"
              name="bikeNumber"
              id="bikeNumber"
              placeholder="Type in your bike number"
            />
          </div>
          <div className="inputField">
          <p>Brand:</p>
          <input 
          type="text" 
          name="bikeBrand" 
          id="bikeBrand"
          placeholder="Type in your bike brand" 
        />
        </div>
        <div className="inputField">
          <p>Model:</p>
          <input 
          type="text" 
          name="bikeModel" 
          id="bikeModel"
          placeholder="Type in your bike model" 
        />
        </div>  
        <div className="inputField">
          <p>Year:</p>
          <input 
          type="number" 
          name="bikeYear"
          id="bikeYear"
          placeholder="Type in your bike year" 
        />
        </div>   
        <div className="inputField">
            <p>Is this bike already sold?</p>
            <select name="bikeSold" defaultValue="">
            <option value="" disabled>Select...</option> {/* Placeholder */}
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            </select>
        </div>

        <div className="inputField">
            <p>Is this bike already broken?</p>
            <select name="bikeBroken" defaultValue="">
            <option value="" disabled>Select...</option> {/* Placeholder */}
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            </select>
        </div> 
        <div className="inputField">
          <p>How many months have you owned this bike?</p>
          <input 
          type="number" 
          name="monthsOwned"
          id="monthsOwned"
          step="1"
          placeholder=""
        />  
        </div>
        <div className="inputField">
          <p>From 1-10 how would rate your experience with this bike? Decimals like 8.8 are usable.</p>
          <input 
          type="number" 
          name="bikeScore" 
          id="handleBikeScore" 
          min="0.0"
          max="10.0"
          step="0.1"
          placeholder=""
        />  
        </div>
            <button type="submit" className="border border-gray-200 text-black bg-teal-600 rounded p-4">
                Submit
            </button>
        </form>
    )
}

export default AddPost;